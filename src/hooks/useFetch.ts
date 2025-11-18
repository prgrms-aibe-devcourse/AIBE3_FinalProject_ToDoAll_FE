import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetch('http://localhost:8080/' + url, {
      signal,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((jsonData: CommonResponse<T>) => {
        setResData(jsonData.data ?? null);
      })
      .catch((err) => console.error(err.errorCode, ' : ', err.message));

    return () => {
      controller.abort();
    };
  }, [url, method, headers, body]);

  return { resData };
}
