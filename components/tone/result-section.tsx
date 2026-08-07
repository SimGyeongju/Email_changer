'use client'

import {
  Check,
  Copy,
  Download,
  MailCheck,
  RefreshCcw,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Purpose, Recipient } from '@/lib/tone-options'

export type ResultStatus = 'idle' | 'loading' | 'done'

type ResultSectionProps = {
  status: ResultStatus
  original: string
  rewritten: string
  subjectLines?: string[]
  recipient: Recipient
  purpose: Purpose
  source?: 'ai' | 'mock'
  onCopy: () => void
  onRegenerate: () => void
  onDownload: () => void
  onCopySubject?: (subject: string) => void
}

export function ResultSection({
  status,
  original,
  rewritten,
  subjectLines = [],
  recipient,
  purpose,
  source = 'ai',
  onCopy,
  onRegenerate,
  onDownload,
  onCopySubject,
}: ResultSectionProps) {
  if (status === 'idle') {
    return <EmptyState />
  }

  if (status === 'loading') {
    return <LoadingState />
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 이메일 추천 제목 섹션 */}
      {subjectLines.length > 0 && (
        <SubjectLinesCard
          subjectLines={subjectLines}
          onCopySubject={onCopySubject}
        />
      )}

      {/* 다듬은 이메일 결과 카드 */}
      <Card className="animate-fade-in-up overflow-hidden">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" aria-hidden="true" />
                다듬은 이메일
              </CardTitle>
              <Badge
                variant={source === 'ai' ? 'default' : 'outline'}
                className="text-[0.65rem] font-semibold"
              >
                {source === 'ai' ? '✨ Gemini AI' : '⚡ 오프라인 엔진'}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge>{recipient}</Badge>
              <Badge variant="secondary">{purpose}</Badge>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={onCopy}>
              <Copy aria-hidden="true" />
              <span className="hidden sm:inline">복사</span>
            </Button>
            <Button variant="outline" size="sm" onClick={onRegenerate}>
              <RefreshCcw aria-hidden="true" />
              <span className="hidden sm:inline">다시 생성</span>
            </Button>
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download aria-hidden="true" />
              <span className="hidden sm:inline">다운로드</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl border border-border/70 bg-secondary/40 p-5">
            <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-foreground">
              {rewritten}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* 비교하기 (Diff View) */}
      <div className="animate-fade-in-up">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-foreground">
            비교하기 (Diff View)
          </h2>
          <span className="text-xs text-muted-foreground">
            수정 및 다듬어진 영역 시각화
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <ComparisonCard label="원본 초안" variant="muted" content={original} />
          <ComparisonCard
            label="다듬은 글"
            variant="primary"
            content={rewritten}
            isDiff
          />
        </div>
      </div>
    </div>
  )
}

function SubjectLinesCard({
  subjectLines,
  onCopySubject,
}: {
  subjectLines: string[]
  onCopySubject?: (subject: string) => void
}) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  function handleCopy(subject: string, index: number) {
    onCopySubject?.(subject)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1500)
  }

  return (
    <Card className="animate-fade-in-up border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-primary">
          <MailCheck className="size-4" aria-hidden="true" />
          추천 이메일 제목 ({subjectLines.length}개)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {subjectLines.map((subject, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/80 px-3.5 py-2.5 shadow-sm transition-colors hover:border-primary/40"
          >
            <span className="text-xs font-medium text-foreground">
              {subject}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(subject, idx)}
              className="h-7 px-2 text-[0.75rem] font-semibold text-primary"
            >
              {copiedIndex === idx ? (
                <>
                  <Check className="mr-1 size-3 text-emerald-500" />
                  복사됨
                </>
              ) : (
                <>
                  <Copy className="mr-1 size-3" />
                  제목 복사
                </>
              )}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ComparisonCard({
  label,
  content,
  variant,
  isDiff = false,
}: {
  label: string
  content: string
  variant: 'muted' | 'primary'
  isDiff?: boolean
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-border/70 bg-card p-4">
      <span
        className={
          variant === 'primary'
            ? 'mb-3 inline-flex w-fit items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary'
            : 'mb-3 inline-flex w-fit items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground'
        }
      >
        {label}
      </span>
      <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
        {isDiff ? (
          <span className="text-foreground font-medium">{content}</span>
        ) : (
          content
        )}
      </pre>
    </div>
  )
}

function EmptyState() {
  return (
    <Card className="flex min-h-[420px] flex-col items-center justify-center gap-5 border-dashed bg-card/60 p-10 text-center">
      <div className="relative grid size-16 place-items-center rounded-3xl bg-accent/60">
        <Sparkles className="size-7 text-primary" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-base font-semibold tracking-tight text-foreground">
          다듬은 이메일이 여기에 표시됩니다.
        </p>
        <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
          이메일을 붙여넣고 받는 사람을 선택하면, 상황에 맞는 어투와 추천 제목을 찾아
          드립니다.
        </p>
      </div>
    </Card>
  )
}

function LoadingState() {
  return (
    <Card className="min-h-[420px] p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Sparkles
            className="size-4 animate-pulse text-primary"
            aria-hidden="true"
          />
          AI가 이메일과 제목을 다듬는 중...
        </div>
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-secondary/30 p-5">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
        <div className="h-2" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </Card>
  )
}
