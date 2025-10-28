'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { User, Mail, Calendar, Trash2, Shield, ShoppingCart, CalendarDays, Loader2, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface UserData {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  _count: {
    appointments: number
    orders: number
  }
}

export default function AdminUsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])


  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateRole = async (id: string, role: string) => {
    try {
      setUpdating(id)
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role }),
      })

      if (response.ok) {
        fetchUsers()
      } else {
        const data = await response.json()
        alert(data.error || 'Fout bij updaten gebruiker')
      }
    } catch (error) {
      console.error('Error updating user:', error)
    } finally {
      setUpdating(null)
    }
  }

  const createTestUser = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: `testuser${Date.now()}@test.be`,
          password: 'test123456',
          acceptedPrivacy: true,
          acceptedTerms: true
        })
      })
      
      if (response.ok) {
        alert('Test gebruiker aangemaakt! Refresh de pagina.')
        fetchUsers()
      } else {
        const data = await response.json()
        alert('Fout: ' + data.error)
      }
    } catch (error) {
      alert('Fout bij aanmaken: ' + error)
    }
  }

  const confirmDelete = (id: string, name: string) => {
    setDeleteConfirm({ id, name })
  }

  const cancelDelete = () => {
    setDeleteConfirm(null)
  }

  const executeDelete = async () => {
    if (!deleteConfirm) return
    
    const { id, name } = deleteConfirm
    setDeleteConfirm(null)

    console.log(`🔵 Starting delete for user: ${id}`)
    
    try {
      setUpdating(id)
      
      const response = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        alert(`Fout: ${data.error || 'Onbekende fout'}`)
        return
      }

      alert('✅ Gebruiker succesvol verwijderd!')
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Fout bij verwijderen: ' + (error instanceof Error ? error.message : String(error)))
    } finally {
      setUpdating(null)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'client':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />
      case 'client':
        return <User className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    clients: users.filter(u => u.role === 'client').length,
  }

  return (
    <>
      {/* Custom Confirm Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Gebruiker Verwijderen</h2>
              <p className="text-slate-600">
                Weet je zeker dat je <span className="font-bold">{deleteConfirm.name}</span> permanent wilt verwijderen?
              </p>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800 font-semibold mb-2">⚠️ Dit verwijdert:</p>
              <ul className="text-sm text-red-700 space-y-1 ml-4">
                <li>• De gebruiker</li>
                <li>• Alle afspraken</li>
                <li>• Alle bestellingen</li>
                <li>• Alle reviews</li>
              </ul>
              <p className="text-sm text-red-800 font-bold mt-2">Dit kan NIET ongedaan gemaakt worden!</p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={cancelDelete}
                variant="outline"
                className="flex-1 border-2 border-slate-300"
              >
                Annuleer
              </Button>
              <Button
                onClick={executeDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Ja, Verwijder
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Gebruikers Beheer</h1>
            <p className="text-slate-600">Bekijk en beheer alle gebruikers</p>
          </div>
          <Button onClick={createTestUser} className="bg-green-600 hover:bg-green-700">
            ➕ Maak Test Gebruiker
          </Button>
        </div>
      </div>

      {/* Statistieken */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-slate-600">Totaal Gebruikers</div>
                <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-slate-600">Administrators</div>
                <div className="text-2xl font-bold text-slate-900">{stats.admins}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-slate-600">Klanten</div>
                <div className="text-2xl font-bold text-slate-900">{stats.clients}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gebruikers Lijst */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">Geen gebruikers gevonden</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* User Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getRoleBadge(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role === 'admin' ? 'Administrator' : 'Klant'}
                      </span>
                      {user.id === session?.user?.id && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                          Jij
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-slate-700">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-bold text-lg">{user.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>Lid sinds {new Date(user.createdAt).toLocaleDateString('nl-BE', { month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Statistieken */}
                    <div className="flex gap-4 pt-2">
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
                        <CalendarDays className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-slate-700">
                          <span className="font-semibold">{user._count.appointments}</span> afspraken
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-lg">
                        <ShoppingCart className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-slate-700">
                          <span className="font-semibold">{user._count.orders}</span> bestellingen
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Acties */}
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      disabled={updating === user.id || user.id === session?.user?.id}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="client">Klant</option>
                      <option value="admin">Administrator</option>
                    </select>

                    <Button
                      onClick={() => confirmDelete(user.id, user.name)}
                      disabled={updating === user.id || user.id === session?.user?.id}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {updating === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      Verwijder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </>
  )
}
