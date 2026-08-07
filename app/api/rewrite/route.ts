import { NextResponse } from 'next/server'

import { requestAIRewrite, type RewriteRequest } from '@/lib/ai-rewrite'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RewriteRequest

    if (!body || !body.email || typeof body.email !== 'string') {
      return NextResponse.json(
        { error: '이메일 초안 내용을 입력해 주세요.' },
        { status: 400 },
      )
    }

    const result = await requestAIRewrite(body)
    return NextResponse.json(result)
  } catch (error) {
    console.error('API Rewrite Error:', error)
    return NextResponse.json(
      { error: '이메일을 다듬는 중 오류가 발생했습니다.' },
      { status: 500 },
    )
  }
}
