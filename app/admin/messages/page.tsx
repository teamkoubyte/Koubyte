'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, User, Phone, Trash2, CheckCircle, Archive, Loader2, MessageSquare } from 'lucide-react'

interface Message {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: string
  createdAt: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [filter])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const url = filter === 'all' 
        ? '/api/admin/messages' 
        : `/api/admin/messages?status=${filter}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdating(id)
      const response = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })

      if (response.ok) {
        fetchMessages()
      }
    } catch (error) {
      console.error('Error updating message:', error)
    } finally {
      setUpdating(null)
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit bericht wilt verwijderen?')) return

    try {
      setUpdating(id)
      const response = await fetch(`/api/admin/messages?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchMessages()
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'read':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'archived':
        return 'bg-slate-100 text-slate-700 border-slate-300'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300'
    }
  }

  const statusOptions = [
    { value: 'new', label: 'Nieuw' },
    { value: 'read', label: 'Gelezen' },
    { value: 'archived', label: 'Gearchiveerd' },
  ]

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Berichten Beheer</h1>
        <p className="text-slate-600">Bekijk en beheer alle contactberichten</p>
      </div>

      {/* Filter Knoppen */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'default' : 'outline'}
          className={filter === 'all' ? 'bg-blue-600 text-white' : ''}
        >
          Alle ({messages.length})
        </Button>
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            onClick={() => setFilter(option.value)}
            variant={filter === option.value ? 'default' : 'outline'}
            className={filter === option.value ? 'bg-blue-600 text-white' : ''}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Berichten Lijst */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : messages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">Geen berichten gevonden</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(message.status)}`}>
                        {statusOptions.find(s => s.value === message.status)?.label || message.status}
                      </span>
                      <span className="text-sm text-slate-500">
                        {new Date(message.createdAt).toLocaleDateString('nl-BE', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold">{message.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <a href={`mailto:${message.email}`} className="hover:text-blue-600 transition-colors">
                        {message.email}
                      </a>
                    </div>
                    {message.phone && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <a href={`tel:${message.phone}`} className="hover:text-blue-600 transition-colors">
                          {message.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <div className="font-bold text-slate-900 text-lg mb-2">{message.subject}</div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-slate-700 whitespace-pre-wrap">{message.message}</p>
                    </div>
                  </div>

                  {/* Acties */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {message.status === 'new' && (
                      <Button
                        onClick={() => updateStatus(message.id, 'read')}
                        disabled={updating === message.id}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {updating === message.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                        Markeer als gelezen
                      </Button>
                    )}
                    {message.status !== 'archived' && (
                      <Button
                        onClick={() => updateStatus(message.id, 'archived')}
                        disabled={updating === message.id}
                        variant="outline"
                        className="border-slate-300"
                      >
                        {updating === message.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4 mr-2" />}
                        Archiveer
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteMessage(message.id)}
                      disabled={updating === message.id}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      {updating === message.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                      Verwijder
                    </Button>
                    <a href={`mailto:${message.email}?subject=Re: ${message.subject}`}>
                      <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                        <Mail className="w-4 h-4 mr-2" />
                        Beantwoord
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
