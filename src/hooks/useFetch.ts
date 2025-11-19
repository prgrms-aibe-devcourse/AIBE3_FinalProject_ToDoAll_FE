import { useEffect, useRef, useState } from 'react';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

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
    controller.current = new AbortController();
    const signal = controller.current.signal;
    fetch(baseUrl + url, {
      signal,
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ~`,
        ...headers,
      },
      body: JSON.stringify(body),
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
