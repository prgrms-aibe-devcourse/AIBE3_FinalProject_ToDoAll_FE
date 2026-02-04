// useAuthedClient.ts
import { useContext, useMemo } from 'react';
import { AuthContext } from '@/AuthContext';
import { authRequest } from '@lib/utils/authRequest';

export type ClientRequestType = {
  request: <T>(
    _url: string,
    _opts?: {
      method?: string;
      headers?: Record<string, any>;
      body?: any;
      signal?: AbortSignal;
    },
    _errMsg?: string | null,
    _isFormData?: boolean
  ) => Promise<T | null>;
};

export function useAuthedClient() {
  const { accessToken, setToken } = useContext(AuthContext);

  return useMemo(() => {
    return {
      request: <T>(
        url: string,
        opts?: {
          method?: string;
          headers?: Record<string, any>;
          body?: any;
          signal?: AbortSignal;
        },
        errMsg?: string | null,
        isFormData?: boolean
      ) =>
        authRequest<T>(
          url,
          accessToken,
          setToken,
          opts?.method,
          opts?.headers,
          opts?.body,
          opts?.signal,
          errMsg,
          isFormData
        ),
    };
  }, [accessToken, setToken]);
}
