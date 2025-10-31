'use client'

import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'

interface BlogShareButtonProps {
  title: string
  excerpt: string
}

export function BlogShareButton({ title, excerpt }: BlogShareButtonProps) {
  const handleShare = async () => {
    const url = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt,
          url,
        })
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        alert('Link gekopieerd naar klembord!')
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleShare}
      className="flex items-center gap-2"
    >
      <Share2 className="w-4 h-4" />
      Deel
    </Button>
  )
}

