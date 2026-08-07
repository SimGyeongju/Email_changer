import { GoogleGenAI } from '@google/genai'

import { mockRewrite } from './mock-rewrite'
import type { Purpose, Recipient } from './tone-options'

export type RewriteRequest = {
  email: string
  recipient: Recipient
  purpose: Purpose
  toneLevel: number
}

export type RewriteResponse = {
  rewritten: string
  subjectLines: string[]
  source: 'ai' | 'mock'
}

function getToneDescription(toneLevel: number): string {
  if (toneLevel >= 66) return '매우 격식 있고 정중하며 예의 바른 어투 (Formal)'
  if (toneLevel >= 33) return '무난하고 자연스러운 비즈니스/일반 어투 (Neutral)'
  return '친근하고 부드러우며 편안한 어투 (Friendly)'
}

function generateMockSubjectLines(purpose: Purpose, recipient: Recipient): string[] {
  return [
    `[${recipient}] ${purpose} 관련 문의 드립니다`,
    `안녕하세요, ${purpose} 건으로 연락드립니다`,
    `${purpose} 건 관련하여 확인 부탁드립니다`,
  ]
}

export async function requestAIRewrite(
  input: RewriteRequest,
): Promise<RewriteResponse> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey || apiKey.trim() === '') {
    return {
      rewritten: mockRewrite(input),
      subjectLines: generateMockSubjectLines(input.purpose, input.recipient),
      source: 'mock',
    }
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    const toneDesc = getToneDescription(input.toneLevel)

    const prompt = `
너는 대한민국 최고의 이메일 작성 및 어투 교정 전문가야.
사용자가 작성한 아래 이메일 초안을 바탕으로 받는 사람과 이메일 목적, 어투 강도에 꼭 어울리는 이메일 본문 및 추천 이메일 제목 3개를 생성해 줘.

[이메일 작성 조건]
1. 받는 사람: ${input.recipient}
2. 이메일 목적: ${input.purpose}
3. 어투 강도: ${input.toneLevel}% - ${toneDesc}
4. 작성 지침:
   - 받으시는 분에 맞는 적절하고 정중한 첫 인사로 시작할 것
   - 사용자가 작성한 초안의 핵심 의도와 전달 내용을 자연스럽고 완성도 높은 문장으로 교정할 것
   - 목적에 부합하는 깔끔한 마무리 인사 및 서명 템플릿([보내는 사람 이름])을 포함할 것
   - 상황과 대상에 잘 어울리는 적절한 이메일 제목 3가지를 함께 제시할 것

[이메일 원본 초안]
${input.email}

[응답 형식]
반드시 다음 JSON 형식으로만 응답해 줘 (JSON 외의 다른 텍스트는 포함하지 말 것):
{
  "subjectLines": ["제목 옵션 1", "제목 옵션 2", "제목 옵션 3"],
  "rewritten": "다듬어진 전체 이메일 본문"
}
`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    })

    const text = response.text
    if (!text) throw new Error('Empty response from Gemini API')

    const parsed = JSON.parse(text) as {
      subjectLines?: string[]
      rewritten?: string
    }

    if (!parsed.rewritten || !Array.isArray(parsed.subjectLines)) {
      throw new Error('Invalid JSON structure returned by AI')
    }

    return {
      rewritten: parsed.rewritten,
      subjectLines: parsed.subjectLines,
      source: 'ai',
    }
  } catch (error) {
    console.warn('[Gemini AI Fallback] Falling back to Mock Engine:', error)
    return {
      rewritten: mockRewrite(input),
      subjectLines: generateMockSubjectLines(input.purpose, input.recipient),
      source: 'mock',
    }
  }
}
