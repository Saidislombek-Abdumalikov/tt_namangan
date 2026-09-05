import { CheckCircle2 } from 'lucide-react'
import type { AppProps } from '../types'
import { formatPrice } from '../data'

interface OrderSuccessProps {
  navigate: AppProps['navigate']
  currentOrder: AppProps['currentOrder']
  handleTabChange: AppProps['handleTabChange']
}

export default function OrderSuccess({ navigate, currentOrder, handleTabChange }: OrderSuccessProps) {
  if (!currentOrder) return null

  return (
    <div className="bg-surface min-h-full flex flex-col items-center px-6 pt-16 pb-10">
      {/* Success icon */}
      <div className="relative mb-6">
        <div className="w-28 h-28 bg-success-light rounded-full flex items-center justify-center">
          <CheckCircle2 size={56} className="text-success" />
        </div>
        <div className="absolute inset-0 rounded-full bg-success/10 animate-ping" style={{ animationDuration: '2s' }} />
      </div>

      <h1 className="text-txt-1 font-extrabold text-2xl text-center mb-2 leading-tight">
        Buyurtmangiz qabul qilindi! 🎉
      </h1>
      <p className="text-txt-2 text-sm text-center leading-relaxed mb-8">
        Kuryerimiz tez orada siz bilan bog'lanadi.
      </p>

      {/* Order info card */}
      <div className="w-full bg-surface-2 rounded-3xl p-5 border border-bdr mb-6">
        {/* Order number */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-bdr">
          <div>
            <div className="text-txt-2 text-xs font-medium">Buyurtma raqami</div>
            <div className="text-txt-1 font-extrabold text-2xl tracking-wider mt-0.5">
              #{currentOrder.number}
            </div>
          </div>
          <div className="bg-primary-light px-4 py-2 rounded-full">
            <span className="text-primary font-bold text-sm">Qabul qilindi</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-txt-2">Taxminiy vaqt</span>
            <span className="text-txt-1 font-bold">30–45 daqiqa</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-txt-2">Umumiy summa</span>
            <span className="text-primary font-extrabold text-base">{formatPrice(currentOrder.total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-txt-2">Manzil</span>
            <span className="text-txt-1 font-medium text-right max-w-[180px] text-xs leading-tight">{currentOrder.address}</span>
          </div>
        </div>
      </div>

      {/* Delivery steps */}
      <div className="w-full bg-surface border border-bdr rounded-2xl px-5 py-4 mb-6">
        <div className="text-txt-2 text-xs font-semibold mb-3">Yetkazish jarayoni</div>
        {[
          { label: "Buyurtma qabul qilindi", done: true },
          { label: "Tayyorlanmoqda", done: false, active: true },
          { label: "Kuryerga berildi", done: false },
          { label: "Yetkazildi", done: false },
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-3 mb-2 last:mb-0">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
              step.done ? 'bg-success' : step.active ? 'bg-primary' : 'bg-bdr'
            }`}>
              {step.done && <div className="w-2 h-2 bg-white rounded-full" />}
              {step.active && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
            </div>
            <span className={`text-sm ${step.done || step.active ? 'text-txt-1 font-medium' : 'text-txt-3'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full space-y-3">
        <button
          onClick={() => navigate('order-tracking')}
          className="w-full bg-primary text-white font-bold text-base py-4 rounded-2xl active:bg-primary-press"
        >
          Buyurtmani kuzatish
        </button>
        <button
          onClick={() => { handleTabChange('home'); navigate('home') }}
          className="w-full bg-surface-2 border border-bdr text-txt-1 font-bold text-base py-4 rounded-2xl active:bg-surface-3"
        >
          Uyga qaytish
        </button>
      </div>
    </div>
  )
}
