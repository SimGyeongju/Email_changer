'use client'

import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

export function Toast({ message, open }: { message: string; open: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-lg shadow-black/10 transition-all duration-300',
        open
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <span className="grid size-4 place-items-center rounded-full bg-primary text-primary-foreground">
        <Check className="size-2.5" aria-hidden="true" />
      </span>
      {message}
    </div>
  )
}
