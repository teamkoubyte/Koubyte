'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { MessageSquare, X, Send, Minimize2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ChatMessage {
  id: string
  conversationId: string
  message: string
  senderType: 'client' | 'admin'
  senderName?: string
  senderEmail?: string
  createdAt: string
  user?: {
    id: string
    name: string
    email: string
    role: string
  }
}

export default function ChatWidget() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [showGuestForm, setShowGuestForm] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Genereer of haal conversationId op
  useEffect(() => {
    if (!conversationId) {
      // Genereer een unieke conversationId
      const storedId = localStorage.getItem('chatConversationId')
      if (storedId) {
        setConversationId(storedId)
      } else {
        const newId = session?.user?.email || `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('chatConversationId', newId)
        setConversationId(newId)
      }
    }
  }, [session, conversationId])

  // Haal messages op bij openen
  useEffect(() => {
    if (isOpen && conversationId) {
      fetchMessages()
      // Poll voor nieuwe messages elke 3 seconden
      const interval = setInterval(() => {
        fetchMessages()
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isOpen, conversationId])

  // Scroll naar beneden bij nieuwe messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const fetchMessages = async () => {
    if (!conversationId) return

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
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId || sending) return

    // Als gast en nog geen naam/email ingevuld
    if (!session && showGuestForm) {
      if (!guestName.trim() || !guestEmail.trim()) {
        alert('Vul je naam en email in om te chatten')
        return
      }
      setShowGuestForm(false)
    }

    const messageText = newMessage.trim()
    setNewMessage('')
    setSending(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message: messageText,
          senderName: !session ? guestName : undefined,
          senderEmail: !session ? guestEmail : undefined,
        }),
      })

      if (response.ok) {
        await fetchMessages() // Refresh messages
      } else {
        alert('Fout bij versturen bericht. Probeer opnieuw.')
        setNewMessage(messageText) // Herstel message
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Fout bij versturen bericht. Probeer opnieuw.')
      setNewMessage(messageText) // Herstel message
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </Button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${isMinimized ? 'w-80' : 'w-96'} transition-all`}>
      <div className="bg-white border-2 border-blue-200 rounded-lg shadow-2xl flex flex-col h-[600px] max-h-[90vh]">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <h3 className="font-semibold text-lg">Live Chat</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-blue-700 h-8 w-8 p-0"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {loading && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm">Start een gesprek!</p>
                  <p className="text-xs mt-1">Stel je vraag en we helpen je graag verder.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isAdmin = msg.senderType === 'admin'
                  const displayName = isAdmin
                    ? 'Koubyte Support'
                    : msg.user?.name || msg.senderName || 'Jij'

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg p-3 ${
                          isAdmin
                            ? 'bg-white border border-blue-200 text-slate-900'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        <div className="text-xs font-semibold mb-1 opacity-75">
                          {displayName}
                        </div>
                        <div className="text-sm whitespace-pre-wrap">{msg.message}</div>
                        <div className={`text-xs mt-1 ${isAdmin ? 'text-slate-500' : 'text-blue-100'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString('nl-BE', {
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

            {/* Guest Form */}
            {!session && showGuestForm && (
              <div className="p-4 bg-blue-50 border-t border-blue-200">
                <p className="text-sm font-semibold text-slate-900 mb-3">Jouw gegevens</p>
                <div className="space-y-2">
                  <Input
                    placeholder="Naam"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="text-sm"
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-slate-200 bg-white rounded-b-lg">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Typ je bericht..."
                  disabled={sending || (!session && showGuestForm)}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim() || (!session && showGuestForm)}
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
            </div>
          </>
        )}
      </div>
    </div>
  )
}

