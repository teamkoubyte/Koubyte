'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'

const categories = [
  { value: 'all', label: 'Alle categorieën' },
  { value: 'hardware', label: 'Hardware' },
  { value: 'software', label: 'Software' },
  { value: 'network', label: 'Netwerk' },
  { value: 'security', label: 'Beveiliging' },
  { value: 'tips', label: 'Tips & Tricks' },
]

interface BlogFiltersProps {
  initialCategory: string
  initialSearch: string
  categoryCounts: Map<string, number>
}

export function BlogFilters({ initialCategory, initialSearch, categoryCounts }: BlogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState(initialCategory)

  const updateFilters = (newCategory: string, newSearch: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (newCategory === 'all') {
      params.delete('category')
    } else {
      params.set('category', newCategory)
    }

    if (newSearch.trim()) {
      params.set('search', newSearch.trim())
    } else {
      params.delete('search')
    }

    startTransition(() => {
      router.push(`/blog?${params.toString()}`)
    })
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    // Debounce search
    const timeoutId = setTimeout(() => {
      updateFilters(category, value)
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    updateFilters(value, search)
  }

  return (
    <div className="mb-8 sm:mb-12">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Zoek artikelen..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-12"
            disabled={isPending}
          />
        </div>
        <Select value={category} onValueChange={handleCategoryChange} disabled={isPending}>
          <SelectTrigger className="w-full sm:w-[250px] h-12">
            <SelectValue placeholder="Categorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label} {cat.value !== 'all' && categoryCounts.get(cat.value) && `(${categoryCounts.get(cat.value)})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

