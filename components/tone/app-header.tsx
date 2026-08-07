import { Mail, Sparkles } from 'lucide-react'

export function AppHeader() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="relative grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
            <Mail className="size-5" aria-hidden="true" />
            <span className="absolute -right-1 -bottom-1 grid size-4 place-items-center rounded-full bg-background">
              <Sparkles className="size-3 text-primary" aria-hidden="true" />
            </span>
          </div>
          <div className="leading-tight">
            <p className="text-[0.9rem] font-semibold tracking-tight text-foreground">
              AI 이메일 어투 도우미
            </p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              받는 사람에 맞게 이메일을 자연스럽게 다듬어 드립니다.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          <Sparkles className="size-3 text-primary" aria-hidden="true" />
          Beta
        </span>
      </div>
    </header>
  )
}
