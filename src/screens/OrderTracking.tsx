import { ArrowLeft, Phone, MapPin, Package } from 'lucide-react'
import type { AppProps } from '../types'
import { formatPrice } from '../data'

interface OrderTrackingProps {
  navigate: AppProps['navigate']
  currentOrder: AppProps['currentOrder']
}

const TIMELINE = [
  { key: 'pending', label: 'Buyurtma qabul qilindi', icon: '✓' },
  { key: 'preparing', label: 'Tayyorlanmoqda', icon: '👨‍🍳' },
  { key: 'on_the_way', label: 'Kuryerga berildi', icon: '📦' },
  { key: 'delivering', label: 'Yetkazilmoqda', icon: '🚚' },
  { key: 'delivered', label: 'Yetkazildi', icon: '🎉' },
]

const STATUS_ORDER = ['pending', 'preparing', 'on_the_way', 'delivering', 'delivered']

export default function OrderTracking({ navigate, currentOrder }: OrderTrackingProps) {
  if (!currentOrder) return null

  const currentIdx = STATUS_ORDER.indexOf(
    currentOrder.status === 'on_the_way' ? 'on_the_way' : currentOrder.status
  )

  // Simulate showing as "preparing" for demo
  const activeIdx = Math.max(1, currentIdx)

  return (
    <div className="bg-surface-2 min-h-full">
      <div className="bg-surface px-5 pt-12 pb-4 flex items-center gap-4">
        <button
          onClick={() => navigate('order-success')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-2"
        >
          <ArrowLeft size={20} className="text-txt-1" />
        </button>
        <div>
          <h1 className="text-txt-1 font-extrabold text-xl">Buyurtma kuzatuvi</h1>
          <div className="text-txt-2 text-xs">#{currentOrder.number}</div>
        </div>
      </div>

      <div className="px-4 pt-3 pb-4 space-y-3">
        {/* Order number card */}
        <div className="bg-primary rounded-3xl p-5 text-white">
          <div className="text-white/70 text-xs font-medium mb-1">Buyurtma raqami</div>
          <div className="font-extrabold text-3xl tracking-widest mb-3">#{currentOrder.number}</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-xs">Taxminiy vaqt</div>
              <div className="font-bold text-base">30–45 daqiqa</div>
            </div>
            <div className="bg-white/20 rounded-2xl px-4 py-2">
              <div className="text-white/70 text-xs">Jami</div>
              <div className="font-bold">{formatPrice(currentOrder.total)}</div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-surface rounded-2xl p-4 border border-bdr">
          <h3 className="text-txt-1 font-bold text-sm mb-4">Buyurtma holati</h3>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-bdr" />
            <div
              className="absolute left-4 top-4 w-0.5 bg-primary transition-all duration-500"
              style={{ height: `${(activeIdx / (TIMELINE.length - 1)) * 100}%` }}
            />
            <div className="space-y-5">
              {TIMELINE.map((step, i) => {
                const done = i < activeIdx
                const active = i === activeIdx
                return (
                  <div key={step.key} className="flex items-center gap-4">
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-colors ${
                        done ? 'bg-success text-white' : active ? 'bg-primary text-white' : 'bg-surface border-2 border-bdr text-txt-3'
                      }`}
                    >
                      {done ? '✓' : active ? <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> : '○'}
                    </div>
                    <span className={`text-sm font-medium ${done || active ? 'text-txt-1' : 'text-txt-3'}`}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Courier */}
        <div className="bg-surface rounded-2xl p-4 border border-bdr">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-txt-1 font-bold text-sm">🚚 Kuryeringiz</h3>
            <span className="text-success text-xs font-semibold bg-success-light px-2 py-1 rounded-full">
              Yo'lda
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format"
                alt="Courier"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="text-txt-1 font-bold">Aziz</div>
              <div className="text-txt-2 text-xs">Kuryer</div>
            </div>
            <button className="flex items-center gap-1.5 bg-primary-light text-primary font-semibold text-sm px-4 py-2.5 rounded-full">
              <Phone size={14} />
              Qo'ng'iroq
            </button>
          </div>
        </div>

        {/* Delivery address */}
        <div className="bg-surface rounded-2xl p-4 border border-bdr">
          <h3 className="text-txt-1 font-bold text-sm mb-3">Yetkazish manzili</h3>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin size={16} className="text-primary" />
            </div>
            <div className="text-txt-1 text-sm font-medium leading-relaxed">{currentOrder.address}</div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-surface rounded-2xl p-4 border border-bdr">
          <h3 className="text-txt-1 font-bold text-sm mb-3">Buyurtma tarkibi</h3>
          <div className="space-y-2">
            {currentOrder.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-txt-1">{item.product.name}</span>
                  <span className="text-txt-2">×{item.quantity}</span>
                </div>
                <span className="text-txt-1 font-semibold">{formatPrice(item.totalPrice)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
