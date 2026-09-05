import { useState } from 'react'
import { ArrowLeft, MapPin } from 'lucide-react'
import type { AppProps, Order, CartItem } from '../types'
import { formatPrice } from '../data'
import { triggerHaptic } from '../services/telegram'
import { api } from '../services/api'

interface CheckoutProps {
  navigate: AppProps['navigate']
  cart: AppProps['cart']
  setCurrentOrder: AppProps['setCurrentOrder']
  showToast: AppProps['showToast']
  user?: AppProps['user']
  addOrder?: AppProps['addOrder']
  userLocation?: string
  userPhone?: string
}

function generateOrderNumber() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function Checkout({
  navigate,
  cart,
  setCurrentOrder,
  showToast,
  user,
  addOrder,
  userLocation,
  userPhone,
}: CheckoutProps) {
  const defaultName = user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Mijoz'
  const [name, setName] = useState(defaultName)
  const [phone, setPhone] = useState(userPhone || '+998 90 123 45 67')
  const [address, setAddress] = useState(userLocation || '')
  const [locationShared, setLocationShared] = useState(Boolean(userLocation))
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0)
  const deliveryFee = 10000
  const discount = subtotal > 50000 ? 5000 : 0
  const total = subtotal + deliveryFee - discount

  const handleShareLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async pos => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          setLocationShared(true)
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            )
            if (res.ok) {
              const data = (await res.json()) as any
              const addr = data.address
              const parts: string[] = []
              if (addr?.road) parts.push(addr.road)
              if (addr?.house_number) parts.push(`${addr.house_number}-uy`)
              if (addr?.suburb || addr?.neighbourhood) parts.push(addr.suburb || addr.neighbourhood)
              if (parts.length > 0) {
                setAddress(parts.join(', '))
                showToast('✓ Geolokatsiya aniqlandi')
                triggerHaptic('impact', 'light')
                return
              }
            }
          } catch {
            // Network fallback
          }
          setAddress(`Namangan sh. (${lat.toFixed(4)}, ${lng.toFixed(4)})`)
          showToast('✓ Geolokatsiya aniqlandi')
          triggerHaptic('impact', 'light')
        },
        () => {
          setLocationShared(true)
          setAddress("Namangan sh., Boburshoh ko'chasi 24")
          showToast('✓ Joylashuv belgilandi')
          triggerHaptic('impact', 'light')
        },
        { timeout: 7000 }
      )
    } else {
      setLocationShared(true)
      setAddress("Namangan sh., Boburshoh ko'chasi 24")
      showToast('✓ Joylashuv belgilandi')
      triggerHaptic('impact', 'light')
    }
  }

  const handleOrder = async () => {
    if (!address && !locationShared) {
      showToast('⚠️ Manzilni kiriting yoki joylashuvni ulashing')
      triggerHaptic('notification', 'warning')
      return
    }
    setLoading(true)

    try {
      // Try backend API creation
      const apiOrder = await api.createOrder({
        items: cart.map(i => ({
          productId: i.product.id,
          quantity: i.quantity,
          extras: i.extras,
        })),
        address: address || "Namangan sh., Boburshoh ko'chasi 24",
        phone,
        customerNote: note,
        telegramId: user?.id,
        customerName: name,
        userId: user?.id ? String(user.id) : undefined,
      })

      const finalOrder: Order = apiOrder
        ? {
            id: apiOrder.id,
            number: (apiOrder as any).orderNumber || apiOrder.number || generateOrderNumber(),
            date: 'Hozir',
            items: cart as CartItem[],
            subtotal: apiOrder.subtotal,
            deliveryFee: apiOrder.deliveryFee,
            discount: apiOrder.discount,
            total: apiOrder.total,
            status: (apiOrder.status?.toLowerCase() as any) || 'pending',
            address: apiOrder.address,
            phone: apiOrder.phone,
            note: (apiOrder as any).customerNote || apiOrder.note || note,
          }
        : {
            id: Date.now().toString(),
            number: generateOrderNumber(),
            date: 'Hozir',
            items: cart as CartItem[],
            subtotal,
            deliveryFee,
            discount,
            total,
            status: 'pending',
            address: address || "Namangan sh., Boburshoh ko'chasi 24",
            phone,
            note,
          }

      setCurrentOrder(finalOrder)
      if (addOrder) {
        addOrder(finalOrder)
      }
      triggerHaptic('notification', 'success')
      setLoading(false)
      navigate('order-success')
    } catch (e) {
      console.warn('Order submission fallback to local:', e)
      const fallbackOrder: Order = {
        id: Date.now().toString(),
        number: generateOrderNumber(),
        date: 'Hozir',
        items: cart as CartItem[],
        subtotal,
        deliveryFee,
        discount,
        total,
        status: 'pending',
        address: address || "Namangan sh., Boburshoh ko'chasi 24",
        phone,
        note,
      }
      setCurrentOrder(fallbackOrder)
      if (addOrder) {
        addOrder(fallbackOrder)
      }
      triggerHaptic('notification', 'success')
      setLoading(false)
      navigate('order-success')
    }
  }

  return (
    <div className="bg-surface-2 min-h-full">
      {/* Header */}
      <div className="bg-surface px-5 pt-12 pb-4 flex items-center gap-4">
        <button
          onClick={() => navigate('cart')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-2"
        >
          <ArrowLeft size={20} className="text-txt-1" />
        </button>
        <h1 className="text-txt-1 font-extrabold text-xl">Buyurtmani rasmiylashtirish</h1>
      </div>

      <div className="px-4 pt-3 pb-4 space-y-3">
        {/* Customer info */}
        <div className="bg-surface rounded-2xl p-4 border border-bdr">
          <h3 className="text-txt-1 font-bold text-sm mb-3">Mijoz ma'lumotlari</h3>
          <div className="space-y-3">
            <div>
              <label className="text-txt-2 text-xs font-medium block mb-1">Ism</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-surface-2 border border-bdr rounded-xl px-4 py-3 text-txt-1 text-sm font-medium outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-txt-2 text-xs font-medium block mb-1">Telefon raqam</label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-surface-2 border border-bdr rounded-xl px-4 py-3 text-txt-1 text-sm font-medium outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className="bg-surface rounded-2xl p-4 border border-bdr">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-txt-1 font-bold text-sm">Yetkazib berish manzili</h3>
            <button
              onClick={handleShareLocation}
              type="button"
              className="text-primary text-xs font-bold flex items-center gap-1 active:opacity-70"
            >
              <MapPin size={13} />
              GPS orqali aniqlash
            </button>
          </div>

          <div className="relative mb-2">
            <input
              value={address}
              onChange={e => {
                setAddress(e.target.value)
                setLocationShared(Boolean(e.target.value))
              }}
              placeholder="Ko'cha, mahalla, uy raqami, mo'ljal..."
              className="w-full bg-surface-2 border border-bdr rounded-xl px-4 py-3 text-txt-1 text-sm outline-none focus:border-primary transition-colors pr-9"
            />
            {address && (
              <button
                type="button"
                onClick={() => {
                  setAddress('')
                  setLocationShared(false)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-txt-3/20 flex items-center justify-center text-txt-2 text-xs font-bold active:scale-95"
              >
                ✕
              </button>
            )}
          </div>

          {locationShared && (
            <div className="flex items-center gap-2 text-success text-xs font-medium bg-success-light/60 px-3 py-1.5 rounded-lg">
              <MapPin size={13} className="text-success flex-shrink-0" />
              <span className="truncate">Yetkazib berish manzili belgilandi</span>
            </div>
          )}
        </div>

        {/* Note */}
        <div className="bg-surface rounded-2xl p-4 border border-bdr">
          <h3 className="text-txt-1 font-bold text-sm mb-3">Yetkazib berish uchun izoh</h3>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Kuryerga izoh qoldiring (ixtiyoriy)..."
            rows={3}
            className="w-full bg-surface-2 border border-bdr rounded-xl px-4 py-3 text-txt-1 text-sm outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        {/* Summary */}
        <div className="bg-surface rounded-2xl p-4 border border-bdr">
          <h3 className="text-txt-1 font-bold text-sm mb-3">Buyurtma xulosasi</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-txt-2">Mahsulotlar ({cart.reduce((a, b) => a + b.quantity, 0)} ta)</span>
              <span className="text-txt-1 font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-txt-2">Yetkazib berish</span>
              <span className="text-txt-1 font-semibold">{formatPrice(deliveryFee)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-txt-2">Chegirma</span>
                <span className="text-success font-semibold">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="h-px bg-bdr" />
            <div className="flex justify-between">
              <span className="text-txt-1 font-bold">Jami</span>
              <span className="text-primary font-extrabold text-lg">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleOrder}
          disabled={loading}
          className="w-full bg-primary text-white font-bold text-base py-4 rounded-2xl active:bg-primary-press transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Yuborilmoqda...
            </>
          ) : (
            'Buyurtma berish'
          )}
        </button>
        <div className="h-4" />
      </div>
    </div>
  )
}
