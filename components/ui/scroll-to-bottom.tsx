'use client'

import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScrollToBottomProps {
  targetId?: string
  className?: string
  label?: string
}

export function ScrollToBottom({ 
  targetId = 'content', 
  className,
  label = 'Scroll'
}: ScrollToBottomProps) {
  const handleClick = () => {
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40 hover:text-white/70 transition-colors',
        className
      )}
      aria-label={`Scroll to ${targetId}`}
    >
      <span className="text-[10px] uppercase tracking-widest">{label}</span>
      <ChevronDown className="w-5 h-5 animate-bounce" />
    </button>
  )
}
