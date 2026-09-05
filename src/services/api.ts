import { CATEGORIES, PRODUCTS, MOCK_ORDERS } from '../data'
import type { Product, Order, CartItem } from '../types'

const API_BASE = (typeof window !== 'undefined' && (window as any).__API_URL__) || 'http://localhost:5000/api'

export const api = {
  /**
   * Fetch categories from backend or fallback to local data.
   */
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/categories`)
      if (res.ok) {
        return await res.json()
      }
    } catch (e) {
      // Offline fallback
    }
    return CATEGORIES
  },

  /**
   * Fetch products from backend or fallback to local data.
   */
  async getProducts(category?: string, search?: string): Promise<Product[]> {
    try {
      const params = new URLSearchParams()
      if (category && category !== 'all') params.append('category', category)
      if (search) params.append('search', search)

      const res = await fetch(`${API_BASE}/products?${params.toString()}`)
      if (res.ok) {
        return await res.json()
      }
    } catch (e) {
      // Offline fallback
    }

    let list = PRODUCTS
    if (category && category !== 'all') {
      list = list.filter(p => p.category === category)
    }
    if (search) {
      const s = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s))
    }
    return list
  },

  /**
   * Submit an order to the backend or fallback to local object creation.
   */
  async createOrder(orderPayload: {
    items: Array<{ productId: string; quantity: number; extras: string[] }>
    address: string
    phone: string
    customerNote?: string
    latitude?: number
    longitude?: number
    userId?: string
  }): Promise<Order | null> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('tt_token') : null
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload),
      })

      if (res.ok) {
        return await res.json()
      }
    } catch (e) {
      console.warn('Backend order submission fallback to local:', e)
    }
    return null
  },

  /**
   * Authenticate Telegram WebApp with backend.
   */
  async loginWithTelegram(initData: string) {
    if (!initData) return null
    try {
      const res = await fetch(`${API_BASE}/auth/telegram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.token && typeof window !== 'undefined') {
          localStorage.setItem('tt_token', data.token)
        }
        return data.user
      }
    } catch (e) {
      console.warn('Telegram auth fallback:', e)
    }
    return null
  },
}
