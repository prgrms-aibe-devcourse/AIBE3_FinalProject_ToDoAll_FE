import { createContext } from 'react';

interface ValueType {
  accessToken: string | null;
  refreshToken: string | null;
  setToken: (_accessToken: string, _refreshToken: string | undefined) => void;
  clearToken: () => void;
}

const defaultValue: ValueType = {
  accessToken: null,
  refreshToken: null,
  setToken: (_accessToken: string, _refreshToken: string | undefined) => {},
  clearToken: () => {},
};

export const AuthContext = createContext<ValueType>(defaultValue);
