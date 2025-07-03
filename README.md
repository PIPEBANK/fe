# Modern React TypeScript Application

최신 기술 스택으로 구성된 React + TypeScript 프로젝트입니다.

## 🛠️ 기술 스택

- **React 19** - 최신 React 버전
- **TypeScript 5.8** - 정적 타입 검사
- **Vite 7** - 빠른 빌드 도구
- **Tailwind CSS 4** - 유틸리티 CSS 프레임워크
- **shadcn/ui** - 모던 UI 컴포넌트 시스템
- **React Router DOM 7** - 클라이언트 사이드 라우팅
- **Axios** - HTTP 클라이언트
- **ESLint** - 코드 품질 관리

## 🚀 시작하기

### 필요 조건
- Node.js 20.19.0 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── ui/             # shadcn/ui 기반 컴포넌트
│   └── Layout.tsx      # 레이아웃 컴포넌트
├── pages/              # 페이지 컴포넌트
├── hooks/              # 커스텀 훅
├── lib/                # 유틸리티 함수들
├── types/              # TypeScript 타입 정의
└── App.tsx             # 메인 애플리케이션
```

## 🔧 주요 기능

- **모던 React**: React 19의 최신 기능 활용
- **TypeScript**: 완전한 타입 안전성
- **반응형 디자인**: Tailwind CSS로 구현
- **다크 모드**: CSS 변수 기반 테마 시스템
- **라우팅**: React Router DOM으로 SPA 구현
- **API 통신**: Axios 인터셉터로 인증 및 에러 처리
- **절대 경로**: `@/` 별칭으로 깔끔한 임포트

## 🎨 스타일링

프로젝트는 Tailwind CSS와 shadcn/ui를 사용합니다:

- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **shadcn/ui**: 접근성과 커스터마이징을 고려한 컴포넌트 시스템
- **CSS 변수**: 동적 테마 지원

## 📝 스크립트

- `npm run dev` - 개발 서버 시작
- `npm run build` - 프로덕션 빌드
- `npm run lint` - ESLint 검사
- `npm run lint:fix` - ESLint 자동 수정
- `npm run type-check` - TypeScript 타입 검사
- `npm run preview` - 빌드 결과 미리보기
- `npm run clean` - 빌드 캐시 정리

## 🌟 개발 가이드

### 컴포넌트 추가
```bash
# UI 컴포넌트는 src/components/ui/ 에
# 페이지 컴포넌트는 src/pages/ 에
# 레이아웃 컴포넌트는 src/components/ 에
```

### API 사용법
```typescript
import api from '@/lib/api'

// GET 요청
const users = await api.get('/users')

// POST 요청
const newUser = await api.post('/users', userData)
```

### 환경 변수
프로젝트 루트에 `.env` 파일을 생성하여 환경 변수를 설정하세요:
```bash
# API 서버 URL
VITE_API_URL=http://localhost:3000/api

# 앱 기본 설정
VITE_APP_NAME="My App"
VITE_APP_VERSION=1.0.0

# 개발 환경 설정
VITE_DEBUG=false
```

**주의**: `.env` 파일은 Git에 커밋되지 않습니다. 각 개발자는 자신의 환경에 맞게 설정해야 합니다.

## 📄 라이선스

MIT License
"# fe" 


#FF6F0F  기본 주황

#FF9F30  살짝연한 주황

#FFCB64  연한 주황

#2A3038 검정 - 베이스 검정(글씨색)

#B0B3BA 그레이 - 아이콘

#868B94 살짝 진한그레이- 설명글씨/ 서브타이틀