import type * as React from 'react'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

type SelectProps = React.ComponentProps<'select'> & {
  icon?: React.ReactNode
}

function Select({ className, icon, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      {icon ? (
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
          {icon}
        </span>
      ) : null}
      <select
        data-slot="select"
        className={cn(
          'h-11 w-full cursor-pointer appearance-none rounded-2xl border border-input bg-background pr-10 text-sm font-medium text-foreground shadow-sm shadow-black/[0.02] transition-colors outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-50',
          icon ? 'pl-10' : 'pl-4',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

export { Select }
