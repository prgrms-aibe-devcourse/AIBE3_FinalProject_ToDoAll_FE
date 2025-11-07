import { Routes, Route } from 'react-router-dom';

// 페이지 import
import InterviewCreatePage from '../features/interview/InterviewCreatePate';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/interview/create" element={<InterviewCreatePage />} />
    </Routes>
  );
}
