import React, { createContext, useContext, useEffect, useState } from "react";
import { saveToken, getToken, deleteToken, saveRefreshToken, getRefreshToken, deleteRefreshToken } from "../lib/secureStorage";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  getUserFromToken: () => any;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  refreshTokens: async () => false,
  getUserFromToken: () => null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  const isTokenValid = (token: string): boolean => {
    try {
   
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decoded = JSON.parse(jsonPayload);
      if (!decoded || !decoded.exp) return false;
      
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  };

  const getUserFromToken = () => {
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  const refreshTokens = async (): Promise<boolean> => {
    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch("http://10.0.2.2:3000/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        await saveToken(data.accessToken);
        await saveRefreshToken(data.refreshToken);
        setToken(data.accessToken);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Token yenileme hatası:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const storedToken = await getToken();
      
      if (storedToken) {
        if (isTokenValid(storedToken)) {
          setToken(storedToken);
        } else {
     
          const refreshed = await refreshTokens();
          if (!refreshed) {
     
            await logout();
          }
        }
      }
      
      setIsLoading(false);
    };

    checkAndRefreshToken();
  }, []);

  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      if (!isTokenValid(token)) {
        const refreshed = await refreshTokens();
        if (!refreshed) {
          await logout();
        }
      }
    }, 5 * 60 * 1000); 

    return () => clearInterval(interval);
  }, [token]);

  const login = async (accessToken: string, refreshToken: string) => {
    setToken(accessToken);
    await saveToken(accessToken);
    await saveRefreshToken(refreshToken);
  };

  const logout = async () => {
    setToken(null);
    await deleteToken();
    await deleteRefreshToken();
  };

  const isAuthenticated = !!token && isTokenValid(token);

  return (
    <AuthContext.Provider value={{ 
      token, 
      isAuthenticated,
      isLoading,
      login, 
      logout, 
      refreshTokens,
      getUserFromToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
