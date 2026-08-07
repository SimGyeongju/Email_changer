export const RECIPIENTS = [
  '교수님',
  '채용 담당자',
  '상사',
  '고객사',
  '동료',
  '친구',
  '고객 지원팀',
  '일반 비즈니스',
] as const

export const PURPOSES = [
  '요청',
  '문의',
  '사과',
  '감사',
  '후속 연락',
  '일정 조율',
  '확인',
  '일반',
] as const

export type Recipient = (typeof RECIPIENTS)[number]
export type Purpose = (typeof PURPOSES)[number]

export const WRITING_TIPS = [
  '요청은 간결하게 작성하세요.',
  '받는 사람과의 관계에 맞는 어투를 쓰세요.',
  '정중한 인사로 마무리하세요.',
] as const
