import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '@/AuthContext.ts';
import { authRequest } from '@lib/utils/authRequest.ts';
let baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

if (baseUrl.endsWith('/api')) {
  baseUrl = baseUrl.slice(0, -4); // '/api' 길이 = 4
}

export default function useFetch<T>(
  url: string,
  defaultValue?: T | null,
  method?: string,
  headers?: Record<string, any>,
  body?: Record<string, any>,
  errMemo?: string
) {
  const [resData, setResData] = useState<T | null>(defaultValue ?? null);
  const controller = useRef<AbortController | null>(null);
  const { accessToken, setToken } = useContext(AuthContext);

  useEffect(() => {
    if (!url) return;

    controller.current = new AbortController();
    const signal = controller.current.signal;

    authRequest<T>(url, accessToken, setToken, method, headers, body, signal)
      .then((data) => {
        setResData(data);
      })
      .catch((err) => {
        console.error(errMemo, err);
      });

    return () => {
      if (controller.current) controller.current.abort();
    };
  }, [url, method, headers, body, accessToken, setToken, errMemo]);

  return { resData };
}
