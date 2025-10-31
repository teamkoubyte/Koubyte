'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Check,
  Loader2,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string | null
  image: string | null
  published: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
}

const categories = [
  'hardware',
  'software',
  'network',
  'security',
  'tips',
]

export const dynamic = 'force-dynamic'
export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    image: '',
    published: false,
  })

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const fetchPosts = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filter === 'published') {
        params.append('published', 'true')
      } else if (filter === 'draft') {
        params.append('published', 'false')
      }
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter)
      }

      const response = await fetch(`/api/blog?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      showToast('Fout bij ophalen blogposts', 'error')
    } finally {
      setLoading(false)
    }
  }, [filter, categoryFilter, showToast])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const openModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post)
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags || '',
        image: post.image || '',
        published: post.published,
      })
    } else {
      setEditingPost(null)
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        tags: '',
        image: '',
        published: false,
      })
    }
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingPost(null)
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      image: '',
      published: false,
    })
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: editingPost ? prev.slug : generateSlug(title),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = editingPost 
        ? `/api/blog/${editingPost.id}`
        : '/api/blog'
      
      const method = editingPost ? 'PATCH' : 'POST'

      const payload = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        showToast(editingPost ? 'Blogpost bijgewerkt!' : 'Blogpost aangemaakt!', 'success')
        fetchPosts()
        closeModal()
      } else {
        showToast(data.error || 'Er is een fout opgetreden', 'error')
      }
    } catch (error) {
      console.error('Error saving blog post:', error)
      showToast('Fout bij opslaan blogpost', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        showToast(data.message || 'Blogpost verwijderd', 'success')
        fetchPosts()
        setDeleteConfirm(null)
      } else {
        showToast(data.error || 'Er is een fout opgetreden', 'error')
      }
    } catch (error) {
      console.error('Error deleting blog post:', error)
      showToast('Fout bij verwijderen blogpost', 'error')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-BE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slideInRight">
          <div className={`${
            toast.type === 'success' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
          } border-2 rounded-lg shadow-2xl p-4 min-w-[300px]`}>
            <div className="flex items-start gap-3">
              {toast.type === 'success' ? (
                <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
              ) : (
                <X className="w-6 h-6 text-red-600 flex-shrink-0" />
              )}
              <p className={`flex-1 ${
                toast.type === 'success' ? 'text-green-900' : 'text-red-900'
              } font-medium`}>
                {toast.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header - RESPONSIVE */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Blog Beheer</h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">Beheer alle blogposts en artikelen</p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Nieuwe Blogpost</span>
          <span className="sm:hidden">Nieuw</span>
        </Button>
      </div>

      {/* Filters - RESPONSIVE */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter op status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle posts</SelectItem>
            <SelectItem value="published">Gepubliceerd</SelectItem>
            <SelectItem value="draft">Concept</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={(value: string) => setCategoryFilter(value)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter op categorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle categorieën</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Posts Grid - RESPONSIVE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="relative flex flex-col">
            {post.published && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <Eye className="w-3 h-3" />
                Live
              </div>
            )}
            
            <CardHeader className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="mt-1">
                    <span className="inline-block bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                      {post.category}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 flex-1 flex flex-col">
              <p className="text-sm text-slate-600 line-clamp-3 flex-1">{post.excerpt}</p>
              
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t">
                <span>{formatDate(post.createdAt)}</span>
                <span>•</span>
                <span>{post.viewCount} views</span>
              </div>

              {post.tags && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.split(',').slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  onClick={() => openModal(post)}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Bewerken</span>
                  <span className="sm:hidden">Edit</span>
                </Button>
                <Button
                  onClick={() => setDeleteConfirm(post.id)}
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Verwijderen</span>
                  <span className="sm:hidden">Delete</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <FileText className="w-16 h-16 mx-auto text-slate-300" />
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Geen blogposts</h3>
              <p className="text-slate-600 mb-6">Begin met het toevoegen van je eerste blogpost</p>
              <Button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-5 h-5 mr-2" />
                Nieuwe Blogpost
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Blogpost verwijderen?</CardTitle>
              <CardDescription>
                Deze actie kan niet ongedaan worden gemaakt.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
              >
                Annuleren
              </Button>
              <Button
                onClick={() => handleDelete(deleteConfirm)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Verwijderen
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto my-4">
            <CardHeader className="sticky top-0 bg-white z-10 border-b">
              <div className="flex items-center justify-between">
                <CardTitle>{editingPost ? 'Blogpost bewerken' : 'Nieuwe Blogpost'}</CardTitle>
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Titel *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      required
                      className="mt-2"
                      placeholder="Bijv. 10 tips om je computer snel te houden"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      className="mt-2"
                      placeholder="bijv-tips-snelle-computer"
                    />
                    <p className="text-xs text-slate-500 mt-1">URL-vriendelijke versie van de titel</p>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="excerpt">Samenvatting *</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      required
                      rows={3}
                      className="mt-2"
                      placeholder="Korte samenvatting die verschijnt in de blog lijst"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                      rows={12}
                      className="mt-2 font-mono text-sm"
                      placeholder="Volledige artikel content (markdown of HTML)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categorie *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                      required
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Selecteer categorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="mt-2"
                      placeholder="tag1, tag2, tag3"
                    />
                    <p className="text-xs text-slate-500 mt-1">Gescheiden door komma&apos;s</p>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="image">Afbeelding URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="mt-2"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center space-x-2">
                    <Checkbox
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, published: checked as boolean })
                      }
                    />
                    <Label htmlFor="published" className="font-normal cursor-pointer">
                      Direct publiceren
                    </Label>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Annuleren
                  </Button>
                  <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Opslaan...
                      </>
                    ) : (
                      'Opslaan'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

