// routes.tsx

import JDDetailDemoPage from '../pages/JDDetailDemoPage';
import InterviewCreatePage from '../features/interview/pages/InterviewCreatePage';
import LoginPage from '../features/auth/pages/LoginPage';
import SignupCompanyEmailPage from '../features/auth/pages/SignupCompanyEmailPage.tsx';
import SignupFormPage from '../features/auth/pages/SignupFormPage.tsx';
import ResetPasswordEmailPage from '../features/auth/pages/ResetPasswordEmailPage';
import MyPage from '../features/auth/pages/MyPage';

// 레이아웃 없는 페이지 (로그인/회원가입 관련)
export const noLayoutRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/interview/create/test', element: <InterviewCreatePage /> },
  { path: '/signup/email', element: <SignupCompanyEmailPage /> },
  { path: '/signup/form', element: <SignupFormPage /> },
  { path: '/forgot', element: <ResetPasswordEmailPage /> },
];

// 메인 레이아웃 적용되는 페이지
export const mainRoutes = [
  { path: '/interview/create', element: <InterviewCreatePage /> },
  { path: '/detail-demo', element: <JDDetailDemoPage /> },
  { path: '/mypage', element: <MyPage /> },
];
