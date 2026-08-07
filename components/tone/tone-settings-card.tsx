'use client'

import { Briefcase, GraduationCap, SlidersHorizontal, Target } from 'lucide-react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import {
  PURPOSES,
  RECIPIENTS,
  type Purpose,
  type Recipient,
} from '@/lib/tone-options'

function toneLabel(level: number): string {
  if (level >= 66) return '격식'
  if (level >= 33) return '중간'
  return '친근함'
}

export function ToneSettingsCard({
  recipient,
  purpose,
  toneLevel,
  onRecipientChange,
  onPurposeChange,
  onToneLevelChange,
}: {
  recipient: Recipient
  purpose: Purpose
  toneLevel: number
  onRecipientChange: (value: Recipient) => void
  onPurposeChange: (value: Purpose) => void
  onToneLevelChange: (value: number) => void
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" aria-hidden="true" />
          어투 설정
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="recipient"
              className="px-1 text-xs font-medium text-muted-foreground"
            >
              받는 사람
            </label>
            <Select
              id="recipient"
              icon={<GraduationCap />}
              value={recipient}
              onChange={(e) => onRecipientChange(e.target.value as Recipient)}
            >
              {RECIPIENTS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="purpose"
              className="px-1 text-xs font-medium text-muted-foreground"
            >
              목적
            </label>
            <Select
              id="purpose"
              icon={<Target />}
              value={purpose}
              onChange={(e) => onPurposeChange(e.target.value as Purpose)}
            >
              {PURPOSES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-secondary/30 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Briefcase className="size-3.5" aria-hidden="true" />
              어투 강도
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {toneLabel(toneLevel)}
            </span>
          </div>
          <label htmlFor="tone-level" className="sr-only">
            친근함에서 격식까지 어투 강도
          </label>
          <input
            id="tone-level"
            type="range"
            min={0}
            max={100}
            step={1}
            value={toneLevel}
            onChange={(e) => onToneLevelChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary outline-none focus-visible:ring-4 focus-visible:ring-ring/15 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm"
            style={{
              background: `linear-gradient(to right, var(--primary) ${toneLevel}%, var(--border) ${toneLevel}%)`,
            }}
          />
          <div className="flex justify-between px-0.5 text-[0.7rem] font-medium text-muted-foreground">
            <span>친근함</span>
            <span>격식</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
