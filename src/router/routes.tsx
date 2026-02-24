import JDDetailPage from '@pages/JDDetailPage';
import InterviewCreatePage from '@features/interview/pages/InterviewCreatePage';
import InterviewManagePage from '@features/interview/pages/InterviewManagePage';
import ResumeDetail from '@features/resumes/pages/ResumeDetail';
import DashBoard from '@pages/DashBoard.tsx';
import JDCreatePage from '@pages/JDCreatePage.tsx';
import MatchList from '@features/match/pages/MatchListPage.tsx';

import JDPage from '@pages/JDPage.tsx';
import InterviewQuestionCreatePage from '@features/interview/pages/InterviewQuestionCreatePage';

import ResumeCreatePage from '@features/resumes/pages/ResumeCreatePage.tsx';
import InterviewChatRoomPage from '@features/interview/pages/InterviewChatRoomPage.tsx';
import LoginPage from '@features/auth/pages/LoginPage';
import SignupCompanyEmailPage from '@features/auth/pages/SignupCompanyEmailPage.tsx';
import SignupFormPage from '@features/auth/pages/SignupFormPage.tsx';
import ResetPasswordEmailPage from '@features/auth/pages/ResetPasswordEmailPage';
import InterviewNotePage from '@features/interview/pages/InterviewNotePage';
import ResetPasswordPage from '@features/auth/pages/ResetPasswordPage.tsx';
import JDEditPage from '@pages/JDEditPage.tsx';
import ResumePreviewPage from '@features/resumes/pages/ResumePreviewPage';
import ResumeSubmitSuccessPage from '@features/resumes/pages/ResumeSubmitSuccessPage';
import MyPage from '@features/user/pages/MyPage.tsx';
import InterviewCHatRoomGuestPage from '@features/interview/pages/InterviewChatRoomGuest';
import JDApplyPage from '@/pages/JDApplyPage';

/**
 * 레이아웃 없는 페이지 (로그인/회원가입 관련)
 */
export const authLayoutRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/signup/email', element: <SignupCompanyEmailPage /> },
  { path: '/signup/form', element: <SignupFormPage /> },
  { path: '/forgot', element: <ResetPasswordEmailPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
];

export const noLayoutRoutes = [
  { path: '/resume/create/:id', element: <ResumeCreatePage /> },
  { path: '/resume/preview', element: <ResumePreviewPage /> },
  { path: '/resume/submit-success', element: <ResumeSubmitSuccessPage /> },
  { path: '/interview/:interviewId/chat-room/guest', element: <InterviewCHatRoomGuestPage /> },
  { path: '/jobs/:id/apply', element: <JDApplyPage /> },
];

/**
 * 메인 레이아웃 적용되는 페이지
 */
export const mainRoutes = [
  { path: '/interview/create', element: <InterviewCreatePage /> },
  { path: '/mypage', element: <MyPage /> },
  { path: '/interview/manage', element: <InterviewManagePage /> },
  { path: '/interview/:interviewId/question-create', element: <InterviewQuestionCreatePage /> },
  { path: '/interview/:interviewId/chat-room', element: <InterviewChatRoomPage /> },
  { path: '/interview/:interviewId/note', element: <InterviewNotePage /> },
  { path: '/resumes/:resumeId', element: <ResumeDetail /> },
  { path: '/dashboard', element: <DashBoard /> },
  { path: '/jobs/new', element: <JDCreatePage /> },
  { path: '/jobs', element: <JDPage /> },
  { path: '/jobs/:id', element: <JDDetailPage /> },
  { path: '/jobs/:id/update', element: <JDEditPage /> },
  { path: '/interview/manage/question-create', element: <InterviewQuestionCreatePage /> },
  { path: '/matches', element: <MatchList /> },
];
