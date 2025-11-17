// routes.tsx

import JDDetailPage from '@pages/JDDetailPage';
import InterviewCreatePage from '@features/interview/pages/InterviewCreatePage';
import InterviewManagePage from '@features/interview/pages/InterviewManagePage';
import ResumeDetail from '@features/resumes/pages/ResumeDetail';
import DashBoard from '@pages/DashBoard.tsx';
import JDCreatePage from '@pages/JDCreatePage.tsx';
import MatchList from '@features/match/pages/MatchListPage.tsx';

import JDPage from '@pages/JDPage.tsx';
import InterviewQuestionCreatePage from '@features/interview/pages/InterviewQuestionCreatePage';

import ResumeForm from '@features/resumes/pages/ResumeCreatePage.tsx';
import InterviewChatRoomPage from '@features/interview/pages/InterviewChatRoomPage.tsx';
import LoginPage from '@features/auth/pages/LoginPage';
import SignupCompanyEmailPage from '@features/auth/pages/SignupCompanyEmailPage.tsx';
import SignupFormPage from '@features/auth/pages/SignupFormPage.tsx';
import ResetPasswordEmailPage from '@features/auth/pages/ResetPasswordEmailPage';
import MyPage from '@features/auth/pages/MyPage';
import InterviewNotePage from '@features/interview/pages/InterviewNotePage';
import ResetPasswordPage from '@features/auth/pages/ResetPasswordPage.tsx';
import JDEditPage from '@pages/JDEditPage.tsx';

// 레이아웃 없는 페이지 (로그인/회원가입 관련)
export const noLayoutRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/interview/create/test', element: <InterviewCreatePage /> },
  { path: '/signup/email', element: <SignupCompanyEmailPage /> },
  { path: '/signup/form', element: <SignupFormPage /> },
  { path: '/forgot', element: <ResetPasswordEmailPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
];

// 메인 레이아웃 적용되는 페이지
export const mainRoutes = [
  { path: '/interview/create', element: <InterviewCreatePage /> },
  { path: '/mypage', element: <MyPage /> },
  { path: '/interview/manage', element: <InterviewManagePage /> },
  { path: '/interview/question-create', element: <InterviewQuestionCreatePage /> },
  { path: '/interview/chat-room', element: <InterviewChatRoomPage /> },
  { path: '/interview/note', element: <InterviewNotePage /> },
  { path: '/resumes/:id', element: <ResumeDetail /> },
  { path: '/dashboard', element: <DashBoard /> },
  { path: '/jobs/new', element: <JDCreatePage /> },
  { path: '/jobs', element: <JDPage /> },
  { path: '/jobs/:id', element: <JDDetailPage /> },
  { path: '/jobs/:id/update', element: <JDEditPage /> },
  { path: '/interview/manage/question-create', element: <InterviewQuestionCreatePage /> },
  { path: '/resumes/create', element: <ResumeForm /> },
  { path: '/matches', element: <MatchList /> },
];
