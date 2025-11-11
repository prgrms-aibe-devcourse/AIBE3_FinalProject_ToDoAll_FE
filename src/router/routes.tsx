// routes.tsx

import JDDetailDemoPage from '../pages/JDDetailDemoPage';
import InterviewCreatePage from '../features/interview/pages/InterviewCreatePage';
import InterviewManagePage from '../features/interview/pages/InterviewManagePage';
import ResumeDetail from '../features/resumes/page/ResumeDetail';
import DashBoard from '../pages/DashBoard.tsx';
import JDCreatePage from '../pages/JDCreatePage.tsx';

import JDPage from '../pages/JDPage.tsx';
import InterviewQuestionCreatePage from '../features/interview/pages/InterviewQuestionCreatePage';
import InterviewChatRoomPage from '../features/interview/pages/InterviewChatRoomPage.tsx';
import LoginPage from '../features/auth/pages/LoginPage';
import SignupCompanyEmailPage from '../features/auth/pages/SignupCompanyEmailPage.tsx';
import SignupFormPage from '../features/auth/pages/SignupFormPage.tsx';
import ResetPasswordEmailPage from '../features/auth/pages/ResetPasswordEmailPage';
import InterviewNotePage from '../features/interview/pages/InterviewNotePage';

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
  { path: '/detail-demo', element: <JDDetailDemoPage /> },
  { path: '/interview/create', element: <InterviewCreatePage /> },
  { path: '/interview/manage', element: <InterviewManagePage /> },
  { path: '/interview/create', element: <InterviewCreatePage /> },
  { path: '/interview/question-create', element: <InterviewQuestionCreatePage /> },
  { path: '/interview/chat-room', element: <InterviewChatRoomPage /> },
  { path: '/interview/note', element: <InterviewNotePage /> },
  { path: '/resumes/:id', element: <ResumeDetail /> },
  { path: '/dashboard', element: <DashBoard /> },
  { path: '/jobs/new', element: <JDCreatePage /> },
  { path: '/jobs', element: <JDPage /> },
];
