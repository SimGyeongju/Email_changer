'use client'

import { Mail } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

const MAX_CHARS = 4000

export function EmailInputCard({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Mail className="size-4 text-primary" aria-hidden="true" />
          내 이메일
        </CardTitle>
        <CardDescription>
          작성한 초안을 붙여넣으세요. 의미는 그대로 살리고 어투만 다듬어
          드립니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <label htmlFor="email-input" className="sr-only">
          이메일 내용
        </label>
        <Textarea
          id="email-input"
          rows={12}
          maxLength={MAX_CHARS}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="작성한 이메일을 붙여넣으세요..."
        />
        <div className="mt-2.5 flex items-center justify-between px-1 text-xs text-muted-foreground">
          <span>10~15줄 정도가 가장 좋아요.</span>
          <span
            className={
              value.length > MAX_CHARS * 0.9
                ? 'font-medium text-primary'
                : undefined
            }
          >
            {value.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
