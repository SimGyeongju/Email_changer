import type { Purpose, Recipient } from './tone-options'

type RewriteInput = {
  email: string
  recipient: Recipient
  purpose: Purpose
  // 0 = 친근함, 100 = 격식
  toneLevel: number
}

const GREETINGS: Record<Recipient, { formal: string; friendly: string }> = {
  교수님: { formal: '교수님께', friendly: '교수님, 안녕하세요' },
  '채용 담당자': {
    formal: '채용 담당자님께',
    friendly: '안녕하세요, 담당자님',
  },
  상사: { formal: '팀장님께', friendly: '팀장님, 안녕하세요' },
  고객사: { formal: '고객님께', friendly: '안녕하세요' },
  동료: { formal: '안녕하세요', friendly: '안녕' },
  친구: { formal: '안녕', friendly: '야, 안녕' },
  '고객 지원팀': { formal: '고객 지원팀 담당자님께', friendly: '안녕하세요, 지원팀 여러분' },
  '일반 비즈니스': { formal: '담당자님께', friendly: '안녕하세요' },
}

const SIGNOFFS = {
  formal: '감사합니다.',
  neutral: '그럼 이만 줄이겠습니다.',
  friendly: '고마워!',
}

const PURPOSE_OPENERS: Record<Purpose, { formal: string; friendly: string }> = {
  요청: {
    formal:
      '아래 내용과 관련하여 도움을 요청드리고자 이렇게 연락드립니다.',
    friendly: '작은 부탁 하나 드리려고 연락했어요.',
  },
  문의: {
    formal:
      '다음 내용에 대해 문의드리고자 연락드립니다.',
    friendly: '몇 가지 궁금한 점이 있어서 여쭤보려고 해요.',
  },
  사과: {
    formal:
      '이번 일로 불편을 끼쳐 드린 점 진심으로 사과드립니다.',
    friendly: '이번 일에 대해 사과하고 싶어요.',
  },
  감사: {
    formal: '보내주신 도움에 진심으로 감사의 말씀을 전합니다.',
    friendly: '정말 고맙다는 말을 전하고 싶었어요.',
  },
  '후속 연락': {
    formal:
      '지난번에 드린 말씀과 관련하여 잘 전달되었는지 확인차 다시 연락드립니다.',
    friendly: '지난번에 드린 이야기 다시 한번 여쭤보려고 해요.',
  },
  '일정 조율': {
    formal:
      '편하신 시간에 만나 뵐 수 있도록 일정을 제안드리고자 합니다.',
    friendly: '언제 시간 맞춰서 한번 얘기 나눌 수 있을까 해서요.',
  },
  확인: {
    formal: '앞서 말씀 나눈 내용을 확인드리고자 연락드립니다.',
    friendly: '내용 한번 확인하려고 연락했어요.',
  },
  일반: {
    formal: '다음 내용을 전해 드리고자 연락드립니다.',
    friendly: '간단히 소식 하나 전하려고 연락했어요.',
  },
}

const PURPOSE_CLOSERS: Record<Purpose, { formal: string; friendly: string }> = {
  요청: {
    formal:
      '도움 주시면 대단히 감사하겠으며, 필요하신 추가 정보가 있으면 언제든 말씀해 주십시오.',
    friendly: '가능한지 알려주면 정말 고맙겠어요!',
  },
  문의: {
    formal: '시간 내어 설명해 주셔서 감사합니다.',
    friendly: '미리 도움 주셔서 감사해요!',
  },
  사과: {
    formal:
      '앞으로 같은 일이 재발하지 않도록 필요한 조치를 취하겠습니다.',
    friendly: '다시는 이런 일 없도록 할게요.',
  },
  감사: {
    formal: '보내주신 도움이 큰 힘이 되었으며, 진심으로 감사드립니다.',
    friendly: '정말 큰 힘이 됐어요.',
  },
  '후속 연락': {
    formal:
      '시간 되실 때 회신 주시면 감사하겠습니다.',
    friendly: '급하진 않으니 시간 될 때 알려줘요!',
  },
  '일정 조율': {
    formal:
      '편하신 시간을 알려 주시면 일정 초대를 보내드리겠습니다.',
    friendly: '괜찮은 시간 알려주면 바로 잡을게요.',
  },
  확인: {
    formal:
      '위 내용 중 조정이 필요한 부분이 있으면 말씀해 주십시오.',
    friendly: '이상한 부분 있으면 알려줘요!',
  },
  일반: {
    formal: '궁금하신 점이 있으시면 언제든 편하게 연락 주십시오.',
    friendly: '어떻게 생각하는지 알려줘요!',
  },
}

function cleanBody(email: string): string {
  return email
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 선택한 받는 사람, 목적, 어투 수준에 따라 자연스럽고 일관된 예시 리라이트를
 * 생성합니다. 네트워크나 AI 호출은 사용하지 않습니다.
 */
export function mockRewrite({
  email,
  recipient,
  purpose,
  toneLevel,
}: RewriteInput): string {
  const isFormal = toneLevel >= 66
  const isNeutral = toneLevel >= 33 && toneLevel < 66
  const key = isFormal ? 'formal' : 'friendly'

  const greeting = GREETINGS[recipient][key]
  const opener = PURPOSE_OPENERS[purpose][key]
  const closer = PURPOSE_CLOSERS[purpose][key]

  const body = cleanBody(email)
  const restatement = body
    ? isFormal
      ? `구체적으로 말씀드리면, ${body}`
      : body
    : ''

  const signoff = isFormal
    ? SIGNOFFS.formal
    : isNeutral
      ? SIGNOFFS.neutral
      : SIGNOFFS.friendly

  const lines = [
    `${greeting},`,
    '',
    opener,
    ...(restatement ? ['', restatement] : []),
    '',
    closer,
    '',
    signoff,
    '[보내는 사람 이름]',
  ]

  return lines.join('\n')
}
