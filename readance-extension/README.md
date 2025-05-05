# Readance Chrome Extension

Chrome 브라우저용 Readance 확장 프로그램입니다.

## 기능

- 웹 페이지에서 텍스트 선택하여 저장
- 웹 페이지 북마크 기능
- 사용자 설정 (테마, 자동 저장 등)

## 개발 환경 설정

### 필수 조건

- Node.js (v14 이상)
- npm 또는 pnpm

### 설치

```bash
# 의존성 설치
pnpm install
```

### 개발 모드 실행

```bash
# 개발 서버 실행
pnpm dev
```

### 빌드

```bash
# 프로덕션용 빌드
pnpm build
```

## Chrome에 확장 프로그램 로드하기

1. Chrome 브라우저를 엽니다.
2. 주소창에 `chrome://extensions/`를 입력합니다.
3. 오른쪽 상단의 "개발자 모드"를 활성화합니다.
4. "압축해제된 확장 프로그램을 로드합니다" 버튼을 클릭합니다.
5. 프로젝트의 `dist` 폴더를 선택합니다.

## 파일 구조

- `public/manifest.json`: Chrome 확장 프로그램 설정 파일
- `src/background.ts`: 백그라운드 스크립트
- `src/content.ts`: 콘텐츠 스크립트 (웹 페이지에 주입)
- `src/popup.ts`: 팝업 UI 스크립트
- `src/options.ts`: 옵션 페이지 스크립트

## 라이선스

MIT
