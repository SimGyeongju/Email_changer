# System Architecture & Technical Specifications

## AI 이메일 말투·문법 다듬기 서비스 (`Email_changer` v2.1)

---

# 1. 시스템 아키텍처 (Architecture Diagram)

```mermaid
graph TD
    User([사용자]) -->|1. 초안 입력 & 옵션 설정| Page[app/page.tsx]
    Page --> ToneConverter[components/tone/tone-converter.tsx]

    subgraph API Route Layer
        ToneConverter -->|2. POST /api/rewrite| APIRoute[app/api/rewrite/route.ts]
        APIRoute --> AIRewriteLib[lib/ai-rewrite.ts]
        AIRewriteLib -->|3. Gemini API 호출| GeminiSDK["GoogleGenAI (@google/genai)"]
        AIRewriteLib -->|4. API 실패 시 폴백| MockEngine[lib/mock-rewrite.ts]
    end

    subgraph UI Component Layer
        ToneConverter --> EmailInputCard[email-input-card.tsx]
        ToneConverter --> ToneSettingsCard[tone-settings-card.tsx]
        ToneConverter --> HistoryCard[history-card.tsx]
        ToneConverter --> ResultSection[result-section.tsx]
        ToneConverter --> TipsCard[tips-card.tsx]
        ToneConverter --> Toast[toast.tsx]
        ResultSection --> ShareDialog[share-dialog.tsx 공유 모달]
    end

    subgraph Sharing & Integration Layer (lib/share-utils.ts)
        ShareDialog -->|Web Share API| NativeShare[OS 네이티브 공유 다이얼로그]
        ShareDialog -->|mailto: | MailApp[기본 메일 앱 연동]
        ShareDialog -->|Twitter Intent| TwitterShare[트위터 / X 공유]
        ShareDialog -->|Kakao SDK| KakaoShare[카카오톡 공유]
    end

    subgraph Browser Storage Layer
        ToneConverter <-->|내역 5건 보관 & 복원| LocalStorage[(Browser LocalStorage)]
    end
```

---

# 2. 프로젝트 디렉터리 구성

```
c:\Email_changer
├── app/
│   ├── api/
│   │   └── rewrite/
│   │       └── route.ts       # Next.js POST API Route (Gemini AI 연동)
│   ├── globals.css            # 글로벌 Tailwind v4 스타일 및 디자인 변수
│   ├── layout.tsx             # Root Layout
│   └── page.tsx               # 메인 랜딩 페이지
├── components/
│   ├── tone/
│   │   ├── app-header.tsx         # 상단 로고 및 헤더
│   │   ├── email-input-card.tsx   # 이메일 초안 입력 카드
│   │   ├── history-card.tsx       # 최근 다듬기 내역 5건 저장/복원 카드
│   │   ├── result-section.tsx     # 다듬은 글, 추천 제목 3종 & Diff View
│   │   ├── share-dialog.tsx       # [NEW Planned] 외부 SNS 및 이메일 공유 모달
│   │   ├── tips-card.tsx          # 이메일 작성 팁 카드
│   │   ├── toast.tsx              # 토스트 피드백 알림
│   │   └── tone-settings-card.tsx # 어투 설정 카드 (8종 대상/목적 + 슬라이더)
│   └── ui/                    # UI 원시 컴포넌트 (Button, Card, Select 등)
├── lib/
│   ├── ai-rewrite.ts          # Google Gen AI SDK 호출 및 폴백 로직
│   ├── mock-rewrite.ts        # 오프라인 규칙 기반 변환 엔진
│   ├── share-utils.ts         # [NEW Planned] Web Share API, mailto:, SNS 공유 유틸리티
│   ├── tone-options.ts        # 대상/목적 데이터 정의
│   └── utils.ts               # Classname 유틸리티
├── Docs/                      # 프로젝트 문서 (PRD, ARCHITECTURE, USER_GUIDE)
├── .env.local                 # GEMINI_API_KEY 환경변수 설정
├── package.json               # 의존성 및 스크립트 정의
└── tsconfig.json              # TypeScript 설정
```

---

# 3. 주요 모듈 및 API 설계

### 1) POST `/api/rewrite` ([app/api/rewrite/route.ts](file:///c:/Email_changer/app/api/rewrite/route.ts))
* **역할**: 클라이언트 요청을 받아 `requestAIRewrite`를 호출하고 결과를 반환합니다.
* **입력 매개변수**: `{ email, recipient, purpose, toneLevel }`
* **출력 데이터**: `{ rewritten, subjectLines: string[], source: 'ai' | 'mock' }`

### 2) 외부 공유 유틸리티 (`lib/share-utils.ts` 설계)
* `shareViaNative({ title, text, url })`: Web Share API 지원 확인 후 OS 공유창 호출.
* `shareViaMailto({ subject, body })`: `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` 실행.
* `shareViaTwitter({ text })`: Twitter Intent 팝업 호출.
* `shareViaKakao({ title, description })`: 카카오톡 공유 처리.

---

# 4. 빌드 및 테스트

```powershell
# 개발 서버 구동
pnpm dev

# 프로덕션 빌드 검증 (Type Check & Route Bundle Verification)
pnpm build
```
