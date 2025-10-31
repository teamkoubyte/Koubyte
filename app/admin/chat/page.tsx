'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Send, Loader2, User, Mail, Clock, AlertCircle, X, CheckCircle } from 'lucide-react'

interface ChatMessage {
  id: string
  conversationId: string
  message: string
  senderType: 'client' | 'admin'
  senderName?: string
  senderEmail?: string
  createdAt: string
  read: boolean
  user?: {
    id: string
    name: string
    email: string
    role: string
  }
}

interface Conversation {
  conversationId: string
  userId?: string
  userName: string
  userEmail: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export const dynamic = 'force-dynamic'
export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch('/api/chat/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      } else if (response.status === 401) {
        setToast({ message: 'Niet geautoriseerd', type: 'error' })
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }, [])

  // Fetch messages
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/chat?conversationId=${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Haal conversaties op en start polling
  useEffect(() => {
    fetchConversations()
    
    // Poll voor nieuwe conversaties en messages elke 5 seconden
    pollingIntervalRef.current = setInterval(() => {
      fetchConversations()
      if (selectedConversation) {
        fetchMessages(selectedConversation)
      }
    }, 5000)
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [selectedConversation, fetchConversations, fetchMessages])

  // Scroll naar beneden bij nieuwe messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSelectConversation = useCallback((conversationId: string) => {
    setSelectedConversation(conversationId)
    fetchMessages(conversationId)
  }, [fetchMessages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return

    const messageText = newMessage.trim()
    setNewMessage('')
    setSending(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation,
          message: messageText,
        }),
      })

      if (response.ok) {
        await fetchMessages(selectedConversation)
        await fetchConversations() // Refresh conversaties
        setToast({ message: 'Bericht verstuurd', type: 'success' })
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Fout bij versturen bericht' }))
        setToast({ message: errorData.error || 'Fout bij versturen bericht. Probeer opnieuw.', type: 'error' })
        setNewMessage(messageText)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setToast({ message: 'Fout bij versturen bericht. Controleer je internetverbinding.', type: 'error' })
      setNewMessage(messageText)
    } finally {
      setSending(false)
    }
  }

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const selectedConv = conversations.find((c) => c.conversationId === selectedConversation)

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100000] border-2 rounded-lg shadow-2xl p-4 min-w-[280px] max-w-md animate-slideInRight ${
          toast.type === 'success' ? 'bg-green-50 border-green-500 text-green-900' : 'bg-red-50 border-red-500 text-red-900'
        }`}>
          <div className="flex items-start gap-3">
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <span className="font-semibold flex-1 text-sm">{toast.message}</span>
            <button onClick={() => setToast(null)} className="opacity-60 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <div className="container mx-auto max-w-7xl py-6 sm:py-8 px-3 sm:px-4 w-full overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6 lg:mb-8">
        Live Chat Beheer
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Conversaties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conversations.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">Geen conversaties</p>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.conversationId}
                    onClick={() => handleSelectConversation(conv.conversationId)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedConversation === conv.conversationId
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <p className="font-semibold text-sm text-slate-900 truncate">
                            {conv.userName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <p className="text-xs text-slate-600 truncate">{conv.userEmail}</p>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-1">
                          {conv.lastMessage || 'Geen berichten'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <p className="text-xs text-slate-400">
                            {new Date(conv.lastMessageTime).toLocaleString('nl-BE', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedConv ? (
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-lg font-semibold">{selectedConv.userName}</p>
                    <p className="text-sm text-slate-500 font-normal">{selectedConv.userEmail}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-slate-400" />
                  Selecteer een conversatie
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedConversation ? (
              <>
                {/* Messages */}
                <div className="h-[500px] overflow-y-auto p-4 space-y-3 bg-slate-50 rounded-lg mb-4">
                  {loading && messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p className="text-sm">Geen berichten in deze conversatie</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isAdmin = msg.senderType === 'admin'
                      const displayName = isAdmin
                        ? 'Jij (Admin)'
                        : msg.user?.name || msg.senderName || 'Klant'

                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-lg p-3 ${
                              isAdmin
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-slate-200 text-slate-900'
                            }`}
                          >
                            <div className="text-xs font-semibold mb-1 opacity-75">
                              {displayName}
                            </div>
                            <div className="text-sm whitespace-pre-wrap">{msg.message}</div>
                            <div className={`text-xs mt-1 ${isAdmin ? 'text-blue-100' : 'text-slate-500'}`}>
                              {new Date(msg.createdAt).toLocaleString('nl-BE', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Typ je antwoord..."
                    disabled={sending}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Druk op Enter om te versturen
                </p>
              </>
            ) : (
              <div className="text-center text-slate-500 py-12">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-semibold mb-2">Geen conversatie geselecteerd</p>
                <p className="text-sm">Selecteer een conversatie uit de lijst om te beginnen</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  )
}

