import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { saveToken, getToken, deleteToken } from '../utils/storage';
import { useRouter } from 'expo-router';

export interface AuthContextType {
  userToken: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean; // Indicates auth loading status
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Manage token check logic
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getToken();
        setUserToken(token);
      } catch (error) {
        console.error('Error checking token', error);
      } 
      finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (token: string) => {
    try {
      await saveToken(token);
      setUserToken(token);
      router.replace('/todos'); // Only navigate after saving token securely
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = async () => {
    try {
      await deleteToken();
      setUserToken(null);
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
