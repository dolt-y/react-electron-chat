import type { AuthUser } from '../interface/auth';

const TOKEN_KEY = 'token';
const USER_KEY = 'auth_user';

export const setAuthData = (token: string, user: AuthUser) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getAuthToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const getAuthUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthUser;
  } catch (error) {
    console.warn('failed to parse auth user, clearing', error);
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
