import { Sparkles } from 'lucide-react'

import { AppHeader } from '@/components/tone/app-header'
import { ToneConverter } from '@/components/tone/tone-converter'

export default function Page() {
  return (
    <div className="min-h-svh bg-background">
      <AppHeader />

      <main className="mx-auto max-w-5xl px-5 pt-10 pb-20 sm:px-8">
        <section className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles className="size-3 text-primary" aria-hidden="true" />
            언제나 딱 맞는 어투의 이메일
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            받는 사람에게 꼭 맞게 이메일을 다듬어 보세요
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground">
            초안을 붙여넣고 받는 사람과 목적을 고르면, 자연스럽고 상황에 어울리는
            문장으로 다듬어 드립니다.
          </p>
        </section>

        <ToneConverter />
      </main>
    </div>
  )
}
