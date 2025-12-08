import { useEffect, useRef, useState } from 'react';
let baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

if (baseUrl.endsWith('/api')) {
  baseUrl = baseUrl.slice(0, -4); // '/api' 길이 = 4
}

console.log('ENV CHECK:', import.meta.env);

interface CommonResponse<T> {
  errorCode?: number;
  message: string;
  data?: T;
}

export default function useFetch<T>(
  url: string,
  defaultValue?: T | null,
  method?: string,
  headers?: Record<string, any>,
  body?: Record<string, any>
) {
  const [resData, setResData] = useState<T | null>(defaultValue ?? null);
  const controller = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!url || url.trim() === '') {
      console.warn('useFetch: 빈 URL로는 요청을 보내지 않습니다.');
      return;
    }

    controller.current = new AbortController();
    const signal = controller.current.signal;
    // URL 앞쪽 / 을 제거 → 중복 /api 방지
    const cleanUrl = url.replace(/^\/+/, '');

    // baseUrl + cleanUrl 합치기
    const finalUrl = `${baseUrl}/${cleanUrl}`;
    console.log('FETCH URL:', finalUrl);
    fetch(finalUrl, {
      signal,
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status + ' : ' + '네트워크 응답이 OK가 아님');
        return res.json();
      })
      .then((jsonData: CommonResponse<T>) => {
        setResData(jsonData.data ?? null);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error(err.message);
      });

    return () => {
      if (controller.current) controller.current.abort();
    };
  }, [url, method, headers, body]);

  return { resData };
}
