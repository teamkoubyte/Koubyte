'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
import type { CartItemWithService } from '@/lib/cart'
import { calculateCartTotal, getCartItemCount } from '@/lib/cart'
import { formatPrice } from '@/lib/utils'

export default function ShoppingCartWidget() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItemWithService[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      fetchCart()
    }
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCart()
    }
    
    window.addEventListener('cart-updated', handleCartUpdate)
    return () => window.removeEventListener('cart-updated', handleCartUpdate)
  }, [session])

  // Block body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY
      
      // Add cart-open class and prevent scrolling
      document.body.classList.add('cart-open')
      document.body.style.top = `-${scrollY}px`
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top
      document.body.classList.remove('cart-open')
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
    
    return () => {
      document.body.classList.remove('cart-open')
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCartItems(data.cartItems || [])
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId, quantity }),
      })

      if (response.ok) {
        await fetchCart()
        // Trigger cart update event
        window.dispatchEvent(new CustomEvent('cart-updated'))
      } else {
        const error = await response.json()
        console.error('Error updating quantity:', error)
        alert('Kon aantal niet bijwerken: ' + (error.error || 'Onbekende fout'))
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      alert('Er ging iets mis bij het bijwerken')
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (cartItemId: string) => {
    setLoading(true)
    try {
      console.log('Removing cart item:', cartItemId)
      const response = await fetch(`/api/cart?id=${cartItemId}`, {
        method: 'DELETE',
      })

      console.log('Delete response status:', response.status)
      
      if (response.ok) {
        console.log('Item removed successfully')
        await fetchCart()
        // Trigger cart update event
        window.dispatchEvent(new CustomEvent('cart-updated'))
      } else {
        let errorText = await response.text()
        console.error('Error removing item - status:', response.status)
        console.error('Error removing item - response:', errorText)
        
        try {
          const errorJson = JSON.parse(errorText)
          alert('Kon item niet verwijderen: ' + (errorJson.error || 'Onbekende fout'))
        } catch {
          alert('Kon item niet verwijderen: ' + errorText)
        }
      }
    } catch (error) {
      console.error('Exception removing item:', error)
      alert('Er ging iets mis bij het verwijderen: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
    } finally {
      setLoading(false)
    }
  }

  if (!session) return null

  const itemCount = getCartItemCount(cartItems)
  const total = calculateCartTotal(cartItems)

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
        data-cart="true"
      >
        <ShoppingCart className="w-6 h-6 text-slate-700" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {/* Sliding Cart Panel */}
      {isOpen && (
        <div 
          className="fixed inset-0" 
          style={{ zIndex: 999999, position: 'fixed' }}
          data-cart="true"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
            data-cart="true"
          />

          {/* Cart Panel */}
          <div 
            className="absolute right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl flex flex-col animate-slideInRight" 
            data-cart="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-slate-900">Winkelwagentje</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 overscroll-contain">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 text-lg">Je winkelwagentje is leeg</p>
                  <Link href="/diensten">
                    <Button className="mt-4" onClick={() => setIsOpen(false)}>
                      Bekijk diensten
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-slate-50 rounded-lg p-4 border">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{item.service.name}</h3>
                          <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                            {item.service.description}
                          </p>
                          <div className="text-lg font-bold text-blue-600 mt-2">
                            {formatPrice(item.service.price)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={loading || item.quantity <= 1}
                            className="p-1 hover:bg-slate-200 rounded disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={loading}
                            className="p-1 hover:bg-slate-200 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Totaal:</span>
                  <span className="text-blue-600">{formatPrice(total)}</span>
                </div>
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <Button className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg">
                    Naar bestellen
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-slate-600 hover:text-slate-900 font-medium"
                >
                  Verder winkelen
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

