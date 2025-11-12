import axios from 'axios';

// BASE_URL 끝의 / 중복 제거 → /api/api 방지
const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const http = axios.create({
  baseURL: BASE_URL, // 모든 요청이 이 주소를 앞에 붙이기
  withCredentials: true, // 서버의 HttpOnly 쿠키도 같이 보내기
});

// 1) 요청 인터셉터: Authorization 자동 주입
http.interceptors.request.use((config) => {
  const at = sessionStorage.getItem('accessToken'); // XSS 줄이려고 메모리 성격이 강한 저장소 사용
  if (at) config.headers.Authorization = `Bearer ${at}`;
  return config; // 수정한 설정을 그대로 돌려보내기
});

// 리프레시 중복 호출 막는 플래그
let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

// 2) 응답 인터셉터: 401이면 1회 리프레시 후 재시도
http.interceptors.response.use(
  (res) => res, // 정상 응답은 그대로 통과
  async (error) => {
    const status = error?.response?.status;
    const original = error?.config;

    // 조건: 401
    if (status === 401 && !original?._retry) {
      original._retry = true; // 같은 요청 무한 반복 막기

      if (isRefreshing) {
        await new Promise<void>((resolve) => pendingQueue.push(resolve));
        const at = sessionStorage.getItem('accessToken');
        if (at) original.headers.Authorization = `Bearer ${at}`;
        return http(original);
      }

      // 리프레시 담당
      isRefreshing = true;
      try {
        const refreshRes = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newAt = refreshRes.data?.accessToken || '';
        if (newAt) sessionStorage.setItem('accessToken', newAt); // 새 토큰 저장
        // 대기 중이던 요청들도 통과
        pendingQueue.forEach((fn) => fn());
        pendingQueue = [];
        const at = sessionStorage.getItem('accessToken');
        if (at) original.headers.Authorization = `Bearer ${at}`;
        return http(original); // 원래 요청을 다시 보내기
      } catch (e) {
        // 리프레시가 실패 -> 로그인 상태를 지우기
        sessionStorage.removeItem('accessToken');
        // window.location.href = '/login';
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default http;
