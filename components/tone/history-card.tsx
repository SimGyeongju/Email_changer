'use client'

import { Clock, History, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Purpose, Recipient } from '@/lib/tone-options'

export type HistoryItem = {
  id: string
  timestamp: string
  original: string
  rewritten: string
  subjectLines?: string[]
  recipient: Recipient
  purpose: Purpose
  toneLevel: number
  source: 'ai' | 'mock'
}

type HistoryCardProps = {
  items: HistoryItem[]
  onSelect: (item: HistoryItem) => void
  onClear: () => void
  onDelete: (id: string) => void
}

export function HistoryCard({
  items,
  onSelect,
  onClear,
  onDelete,
}: HistoryCardProps) {
  if (items.length === 0) return null

  return (
    <Card className="animate-fade-in-up">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <History className="size-4 text-primary" aria-hidden="true" />
          최근 다듬은 내역 ({items.length})
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-7 text-xs text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="mr-1 size-3" aria-hidden="true" />
          전체 삭제
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col gap-2 rounded-xl border border-border/70 bg-secondary/20 p-3 transition-colors hover:border-primary/40 hover:bg-secondary/40"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[0.65rem]">
                  {item.recipient}
                </Badge>
                <Badge variant="secondary" className="text-[0.65rem]">
                  {item.purpose}
                </Badge>
                <span className="flex items-center gap-1 text-[0.7rem] text-muted-foreground">
                  <Clock className="size-3" aria-hidden="true" />
                  {item.timestamp}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item.id)}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                title="삭제"
              >
                <Trash2 className="size-3" aria-hidden="true" />
              </Button>
            </div>
            <p className="line-clamp-2 text-xs text-foreground/80 leading-relaxed">
              {item.rewritten}
            </p>
            <div className="flex justify-end">
              <Button
                variant="link"
                size="sm"
                onClick={() => onSelect(item)}
                className="h-auto p-0 text-xs text-primary font-medium"
              >
                이 결과 복원하기 →
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
