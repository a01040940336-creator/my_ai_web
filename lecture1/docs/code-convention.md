# Code Convention

## 파일 명명 규칙
- 컴포넌트: PascalCase (예: MyComponent.jsx)
- 유틸리티: camelCase (예: formatDate.js)
- 스타일: camelCase (예: myStyles.js)

## 컴포넌트 구조
```jsx
import React from 'react'

const ComponentName = ({ prop1, prop2 }) => {
  return (
    <div>
      {/* 내용 */}
    </div>
  )
}

export default ComponentName
```

## 임포트 순서
1. React 관련
2. 외부 라이브러리 (MUI 등)
3. 내부 컴포넌트
4. 유틸리티/훅
5. 스타일/에셋

## 주석 규칙
- 복잡한 로직에만 한국어 주석 추가
- TODO, FIXME 태그 활용
