# 새 프로젝트 시작 가이드

## 프로젝트 생성 절차
1. `_template_settings` 폴더를 새 프로젝트명으로 복사
2. `package.json`의 `name` 필드 수정
3. `npm install` 실행 (node_modules 재생성)
4. `src/App.jsx` 초기화
5. `npm run dev`로 개발 서버 시작

## 디렉토리 구조
```
my-project/
├── src/
│   ├── components/   # 재사용 컴포넌트
│   ├── pages/        # 페이지 컴포넌트
│   ├── hooks/        # 커스텀 훅
│   ├── utils/        # 유틸리티 함수
│   ├── theme.js      # MUI 테마 설정
│   ├── main.jsx      # 앱 진입점
│   └── App.jsx       # 루트 컴포넌트
├── public/
└── index.html
```

## 필수 확인 사항
- ThemeProvider 적용 여부
- CssBaseline 적용 여부
- React Router 설정 여부
