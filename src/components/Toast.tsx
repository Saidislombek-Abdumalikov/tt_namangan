interface ToastProps {
  message: string
}

export default function Toast({ message }: ToastProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-50 pointer-events-none">
      <div className="bg-txt-1 text-white text-sm font-medium px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
        <span>{message}</span>
      </div>
    </div>
  )
}
