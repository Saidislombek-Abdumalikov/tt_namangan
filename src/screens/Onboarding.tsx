import { useState } from 'react'
import type { AppProps } from '../types'

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=900&fit=crop&auto=format',
    headline: 'Sizni ochlik\nqiynayaptimi?',
    sub: 'Issiqqina va mazali taomlarni tezkor buyurtma qiling.',
  },
  {
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=900&fit=crop&auto=format',
    headline: 'Bu qanday\nishlaydi?',
    sub: 'Taomni tanlang, buyurtma bering va rohatlaning.',
    steps: [
      { icon: '🍔', label: 'Tanlang' },
      { icon: '📱', label: 'Buyurtma bering' },
      { icon: '😊', label: 'Rohatlaning' },
    ],
  },
  {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=900&fit=crop&auto=format',
    headline: 'Buyurtma berishga\ntayyormisiz?',
    sub: "Sevimli taomlaringiz bir necha bosqichda eshigingizgacha.",
    social: true,
  },
]

interface OnboardingProps {
  navigate: AppProps['navigate']
  handleTabChange: AppProps['handleTabChange']
  onFinish?: () => void
}

export default function Onboarding({ navigate, handleTabChange, onFinish }: OnboardingProps) {
  const [step, setStep] = useState(0)

  const finish = () => {
    if (onFinish) {
      onFinish()
    } else {
      handleTabChange('home')
      navigate('home')
    }
  }

  const next = () => {
    if (step < SLIDES.length - 1) setStep(s => s + 1)
    else finish()
  }

  const slide = SLIDES[step]

  return (
    <div className="relative h-screen bg-txt-1 flex flex-col overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={slide.image}
          alt={slide.headline}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
      </div>

      {/* Skip */}
      {step < SLIDES.length - 1 && (
        <button
          onClick={finish}
          className="absolute top-12 right-5 text-white/70 text-sm font-semibold z-10"
        >
          O'tkazib yuborish
        </button>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end flex-1 px-6 pb-10">
        {/* Steps visual for slide 2 */}
        {slide.steps && (
          <div className="flex items-center gap-4 mb-8">
            {slide.steps.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl border border-white/20">
                    {s.icon}
                  </div>
                  <span className="text-white text-xs font-semibold">{s.label}</span>
                </div>
                {i < slide.steps!.length - 1 && (
                  <div className="w-8 h-px bg-white/30 mb-4" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Social proof for slide 3 */}
        {slide.social && (
          <div className="flex items-center gap-3 mb-8 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/15">
            <div className="flex -space-x-2">
              {['photo-1535713875002-d1d0cf377fde', 'photo-1494790108377-be9c29b29330', 'photo-1527980965255-d3b416303d12'].map((id, i) => (
                <img
                  key={i}
                  src={`https://images.unsplash.com/${id}?w=40&h=40&fit=crop&auto=format`}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  alt=""
                />
              ))}
            </div>
            <div>
              <div className="text-white font-bold text-sm">12,000+ mijoz</div>
              <div className="text-white/60 text-xs">har kuni bizga ishonadi</div>
            </div>
            <div className="ml-auto text-yellow-400 text-sm font-bold">⭐ 4.9</div>
          </div>
        )}

        <h1 className="text-white font-extrabold text-[2.2rem] leading-tight mb-3 whitespace-pre-line">
          {slide.headline}
        </h1>
        <p className="text-white/75 text-base leading-relaxed mb-8">{slide.sub}</p>

        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-6">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'bg-primary w-8' : 'bg-white/30 w-1.5'
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={next}
          className="w-full bg-primary text-white font-bold text-base py-4 rounded-2xl active:bg-primary-press transition-colors"
        >
          {step < SLIDES.length - 1 ? 'Davom etish' : 'Boshla'}
        </button>
      </div>
    </div>
  )
}
