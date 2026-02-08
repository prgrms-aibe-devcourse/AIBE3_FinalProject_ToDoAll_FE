import { debugLog } from '@lib/utils/debugLog';

interface CommonResponse<T> {
  errorCode?: number;
  message: string;
  data?: T;
}

type Tokens = { accessToken: string; refreshToken: string };

type RefreshResponse = CommonResponse<Tokens>;

let refreshPromise: Promise<Tokens> | null = null;

function resolveBaseUrl() {
  let baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

async function refreshAccessToken(baseUrl: string): Promise<Tokens> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('refresh token not found');
  if (!refreshPromise) {
    refreshPromise = fetch(`${baseUrl}/api/v1/auth/token/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`refresh failed: ${res.status}`);
        const json = (await res.json()) as RefreshResponse;
        if (json.data) return json.data;
        else throw new Error('refresh failed: no data');
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function authRequest<T>(
  url: string,
  accessToken: string | null,
  setToken: (_accessToken: string, _refreshToken: string) => void,
  method: string = 'GET',
  headers?: Record<string, any>,
  body?: Record<string, any>,
  signal?: AbortSignal,
  errMsg?: string | null,
  isFormData?: boolean
): Promise<T | null> {
  const baseUrl = resolveBaseUrl();
  const cleanUrl = url.replace(/^\/+/, '');
  const finalUrl = `${baseUrl}/${cleanUrl}`;

  debugLog('FETCH URL:', finalUrl);

  headers = headers || {};
  if (!isFormData && !headers['Content-Type']) headers['Content-Type'] = 'application/json';

  const doFetch = (token: string | null) =>
    fetch(finalUrl, {
      signal,
      method,
      credentials: 'include',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body:
        body && method !== 'GET' && method !== 'HEAD'
          ? isFormData
            ? (body as FormData)
            : JSON.stringify(body)
          : null,
    });

  try {
    let res = await doFetch(accessToken);

    if (res.status === 401 || res.status === 403) {
      const { accessToken, refreshToken } = await refreshAccessToken(baseUrl);
      debugLog('TOKEN:', accessToken, ', ', refreshToken);
      setToken(accessToken, refreshToken);
      res = await doFetch(accessToken);
    }

    if (!res.ok) new Error(`${res.status} : ${errMsg ?? '네트워크 응답이 OK가 아닙니다.'}`);

    const json = (await res.json()) as CommonResponse<T>;
    return json.data ?? null;
  } catch (err: any) {
    if (err.name === 'AbortError') return null;
    console.error(err.message ?? err);
    throw err;
  }
}
