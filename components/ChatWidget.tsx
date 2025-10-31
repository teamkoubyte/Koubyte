'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { MessageSquare, X, Send, Minimize2, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
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

// Helper functies
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

const getOrCreateConversationId = (session: any): string => {
  if (session?.user?.email) {
    return session.user.email
  }
  
  // Check localStorage voor bestaande ID
  const stored = localStorage.getItem('chatConversationId')
  if (stored) {
    return stored
  }
  
  // Maak nieuwe ID
  const newId = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  localStorage.setItem('chatConversationId', newId)
  return newId
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
  
  // Guest data state
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [showGuestForm, setShowGuestForm] = useState(true)
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize conversation ID
  useEffect(() => {
    if (!conversationId) {
      const id = getOrCreateConversationId(session)
      setConversationId(id)
    }
  }, [session, conversationId])

  // Load guest data from localStorage
  useEffect(() => {
    if (!session && conversationId) {
      const storedName = localStorage.getItem('chatGuestName')
      const storedEmail = localStorage.getItem('chatGuestEmail')
      
      if (storedName && storedEmail && isValidEmail(storedEmail)) {
        setGuestName(storedName)
        setGuestEmail(storedEmail)
        setShowGuestForm(false)
      }
    } else if (session) {
      setShowGuestForm(false)
    }
  }, [session, conversationId])

  // Validate and save guest data when fields change
  useEffect(() => {
    if (!session && guestName.trim() && guestEmail.trim()) {
      if (isValidEmail(guestEmail.trim())) {
        // Save to localStorage
        localStorage.setItem('chatGuestName', guestName.trim())
        localStorage.setItem('chatGuestEmail', guestEmail.trim())
        // Hide form if both are valid
        if (guestName.trim().length >= 2) {
          setShowGuestForm(false)
        }
      }
    }
  }, [guestName, guestEmail, session])

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!conversationId || !isOpen) return

    try {
      // Voor gasten: voeg senderEmail toe aan request voor validatie
      const url = session 
        ? `/api/chat?conversationId=${conversationId}`
        : `/api/chat?conversationId=${encodeURIComponent(conversationId)}${guestEmail ? `&senderEmail=${encodeURIComponent(guestEmail.trim())}` : ''}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      } else if (response.status === 403) {
        // 403 = Forbidden = security issue
        const errorData = await response.json().catch(() => ({ error: 'Geen toegang tot deze conversatie' }))
        setToast({ message: errorData.error || 'Geen toegang tot deze conversatie', type: 'error' })
        // Reset conversationId om nieuwe conversatie te starten
        if (!session) {
          const newId = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
          localStorage.setItem('chatConversationId', newId)
          setConversationId(newId)
        }
      } else if (response.status !== 404) {
        // Only show error if it's not a 404 (conversation doesn't exist yet)
        const errorData = await response.json().catch(() => ({ error: 'Fout bij ophalen berichten' }))
        if (errorData.error && !errorData.error.includes('does not exist')) {
          setToast({ message: errorData.error || 'Fout bij ophalen berichten', type: 'error' })
        }
      }
    } catch (error) {
      // Silent fail for network errors during polling
      if (isOpen) {
        console.error('Error fetching messages:', error)
      }
    }
  }, [conversationId, isOpen, session, guestEmail])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current && !loading) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [messages.length, loading])

  // Start polling when chat is open
  useEffect(() => {
    if (isOpen && conversationId && !isMinimized) {
      // Initial fetch
      setLoading(true)
      fetchMessages().finally(() => setLoading(false))
      
      // Poll every 3 seconds
      pollingIntervalRef.current = setInterval(() => {
        fetchMessages()
      }, 3000)
      
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
          pollingIntervalRef.current = null
        }
      }
    } else {
      // Stop polling when chat is closed or minimized
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [isOpen, conversationId, isMinimized, fetchMessages])

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Check if guest can send messages
  const canSendMessage = useCallback((): boolean => {
    if (session) return true
    if (!guestName.trim() || !guestEmail.trim()) return false
    return isValidEmail(guestEmail.trim())
  }, [session, guestName, guestEmail])

  // Send message
  const handleSendMessage = async () => {
    const messageText = newMessage.trim()
    
    if (!messageText || !conversationId || sending) return

    // Validate guest data
    if (!session) {
      if (!guestName.trim() || !guestEmail.trim()) {
        setToast({ message: 'Vul je naam en email in om te chatten', type: 'error' })
        return
      }
      if (!isValidEmail(guestEmail.trim())) {
        setToast({ message: 'Voer een geldig email adres in', type: 'error' })
        return
      }
    }

    setNewMessage('')
    setSending(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message: messageText,
          senderName: !session ? guestName.trim() : undefined,
          senderEmail: !session ? guestEmail.trim() : undefined,
        }),
      })

      if (response.ok) {
        // Refresh messages immediately
        await fetchMessages()
        // Auto-scroll
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Fout bij versturen bericht' }))
        setToast({ 
          message: errorData.error || errorData.message || 'Fout bij versturen bericht. Probeer opnieuw.', 
          type: 'error' 
        })
        setNewMessage(messageText) // Restore message
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setToast({ message: 'Fout bij versturen bericht. Controleer je internetverbinding.', type: 'error' })
      setNewMessage(messageText) // Restore message
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  // Toast component
  const Toast = toast && (
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
  )

  // Closed state - show button
  if (!isOpen) {
    return (
      <>
        {Toast}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
            aria-label="Open live chat"
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </Button>
        </div>
      </>
    )
  }

  // Open state - show chat widget
  return (
    <>
      {Toast}
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
                aria-label={isMinimized ? 'Maximaliseer' : 'Minimaliseer'}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false)
                  setIsMinimized(false)
                }}
                className="text-white hover:bg-blue-700 h-8 w-8 p-0"
                aria-label="Sluiten"
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
                    <p className="text-sm font-semibold">Start een gesprek!</p>
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
                          <div className="text-sm whitespace-pre-wrap break-words">{msg.message}</div>
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
                      autoComplete="name"
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="text-sm"
                      autoComplete="email"
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
                    disabled={sending || !canSendMessage()}
                    className="flex-1"
                    maxLength={2000}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sending || !newMessage.trim() || !canSendMessage()}
                    className="bg-blue-600 hover:bg-blue-700"
                    aria-label="Verstuur bericht"
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
    </>
  )
}
