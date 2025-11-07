// routes.tsx

import JDDetailDemoPage from '../pages/JDDetailDemoPage';
import InterviewCreatePage from '../features/interview/pages/InterviewCreatePage';

// 레이아웃 없는 페이지 (로그인/회원가입 관련)
export const noLayoutRoutes = [
  { path: '/interview/create/test', element: <InterviewCreatePage /> },
];

// 메인 레이아웃 적용되는 페이지
export const mainRoutes = [
  { path: '/interview/create', element: <InterviewCreatePage /> },
  { path: '/detail-demo', element: <JDDetailDemoPage /> },
];
