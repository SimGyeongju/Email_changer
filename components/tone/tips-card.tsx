import { Lightbulb } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WRITING_TIPS } from '@/lib/tone-options'

export function TipsCard() {
  return (
    <Card className="bg-accent/40">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Lightbulb className="size-4 text-primary" aria-hidden="true" />
          작성 팁
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2.5">
          {WRITING_TIPS.map((tip) => (
            <li
              key={tip}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
            >
              <span
                className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60"
                aria-hidden="true"
              />
              {tip}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
