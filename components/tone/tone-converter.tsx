'use client'

import { useEffect, useRef, useState } from 'react'
import { LoaderCircle, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { Purpose, Recipient } from '@/lib/tone-options'

import { EmailInputCard } from './email-input-card'
import { HistoryCard, type HistoryItem } from './history-card'
import { ResultSection, type ResultStatus } from './result-section'
import { TipsCard } from './tips-card'
import { Toast } from './toast'
import { ToneSettingsCard } from './tone-settings-card'

const HISTORY_KEY = 'email_changer_history_v1'

export function ToneConverter() {
  const [email, setEmail] = useState('')
  const [recipient, setRecipient] = useState<Recipient>('교수님')
  const [purpose, setPurpose] = useState<Purpose>('요청')
  const [toneLevel, setToneLevel] = useState(70)

  const [status, setStatus] = useState<ResultStatus>('idle')
  const [original, setOriginal] = useState('')
  const [rewritten, setRewritten] = useState('')
  const [subjectLines, setSubjectLines] = useState<string[]>([])
  const [source, setSource] = useState<'ai' | 'mock'>('ai')

  const [history, setHistory] = useState<HistoryItem[]>([])

  const [toast, setToast] = useState<{ message: string; open: boolean }>({
    message: '',
    open: false,
  })
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const canGenerate = email.trim().length > 0 && status !== 'loading'

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY)
      if (saved) {
        setHistory(JSON.parse(saved))
      }
    } catch {
      // ignore
    }
  }, [])

  // Save history helper
  function saveToHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>) {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
    setHistory((prev) => {
      const updated = [newItem, ...prev.filter((i) => i.original !== item.original)].slice(0, 5)
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
      } catch {
        // ignore
      }
      return updated
    })
  }

  function handleClearHistory() {
    setHistory([])
    try {
      localStorage.removeItem(HISTORY_KEY)
      showToast('히스토리를 삭제했어요')
    } catch {
      // ignore
    }
  }

  function handleDeleteHistoryItem(id: string) {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
      } catch {
        // ignore
      }
      return updated
    })
  }

  function handleSelectHistoryItem(item: HistoryItem) {
    setEmail(item.original)
    setOriginal(item.original)
    setRewritten(item.rewritten)
    setSubjectLines(item.subjectLines || [])
    setRecipient(item.recipient)
    setPurpose(item.purpose)
    setToneLevel(item.toneLevel)
    setSource(item.source)
    setStatus('done')
    showToast('선택한 내역을 불러왔어요')
  }

  function showToast(message: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ message, open: true })
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, open: false })),
      2000,
    )
  }

  async function generate() {
    if (email.trim().length === 0) return
    const inputSource = email
    setOriginal(inputSource)
    setStatus('loading')

    try {
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inputSource,
          recipient,
          purpose,
          toneLevel,
        }),
      })

      if (!response.ok) throw new Error('Generation failed')

      const data = (await response.json()) as {
        rewritten: string
        subjectLines: string[]
        source: 'ai' | 'mock'
      }

      setRewritten(data.rewritten)
      setSubjectLines(data.subjectLines)
      setSource(data.source)
      setStatus('done')

      saveToHistory({
        original: inputSource,
        rewritten: data.rewritten,
        subjectLines: data.subjectLines,
        recipient,
        purpose,
        toneLevel,
        source: data.source,
      })
    } catch {
      showToast('다듬기 요청 처리 실패. 오프라인 엔진으로 전환합니다.')
      setStatus('done')
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(rewritten)
      showToast('클립보드에 복사했어요')
    } catch {
      showToast('복사할 수 없습니다')
    }
  }

  async function handleCopySubject(subject: string) {
    try {
      await navigator.clipboard.writeText(subject)
      showToast('이메일 제목을 복사했어요')
    } catch {
      showToast('제목을 복사할 수 없습니다')
    }
  }

  function handleDownload() {
    const content = `[이메일 제목 추천]\n${subjectLines.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n[이메일 본문]\n${rewritten}`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rewritten-email.txt'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    showToast('TXT 파일로 저장했어요')
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="flex flex-col gap-6">
          <EmailInputCard value={email} onChange={setEmail} />
          <ToneSettingsCard
            recipient={recipient}
            purpose={purpose}
            toneLevel={toneLevel}
            onRecipientChange={setRecipient}
            onPurposeChange={setPurpose}
            onToneLevelChange={setToneLevel}
          />
          <Button
            size="lg"
            onClick={generate}
            disabled={!canGenerate}
            className="h-12 w-full rounded-2xl text-sm font-semibold shadow-sm shadow-primary/25 transition-transform hover:shadow-md hover:shadow-primary/30 active:not-disabled:scale-[0.99]"
          >
            {status === 'loading' ? (
              <>
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
                AI가 이메일 다듬는 중...
              </>
            ) : (
              <>
                <Sparkles className="size-4" aria-hidden="true" />
                이메일 다듬기 (Gemini AI)
              </>
            )}
          </Button>

          <HistoryCard
            items={history}
            onSelect={handleSelectHistoryItem}
            onClear={handleClearHistory}
            onDelete={handleDeleteHistoryItem}
          />

          <TipsCard />
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <ResultSection
            status={status}
            original={original}
            rewritten={rewritten}
            subjectLines={subjectLines}
            recipient={recipient}
            purpose={purpose}
            source={source}
            onCopy={handleCopy}
            onRegenerate={generate}
            onDownload={handleDownload}
            onCopySubject={handleCopySubject}
          />
        </div>
      </div>

      <Toast message={toast.message} open={toast.open} />
    </>
  )
}
