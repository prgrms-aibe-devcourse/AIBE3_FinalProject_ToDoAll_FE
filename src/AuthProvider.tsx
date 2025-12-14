import { useState, type ReactNode } from 'react';
import { AuthContext } from '@/AuthContext.ts';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem('accessToken')
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    localStorage.getItem('refreshToken')
  );

  const setToken = (access: string, refresh?: string | null) => {
    localStorage.setItem('accessToken', access);
    setAccessToken(access);

    if (refresh != null) {
      localStorage.setItem('refreshToken', refresh);
      setRefreshToken(refresh);
    }
  };

  const clearToken = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext
      value={{
        accessToken,
        refreshToken,
        setToken,
        clearToken,
      }}
    >
      {children}
    </AuthContext>
  );
}
