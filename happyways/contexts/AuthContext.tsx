import React, { createContext, useContext, useEffect, useState } from "react";
import { saveToken, getToken, deleteToken, saveRefreshToken, getRefreshToken, deleteRefreshToken } from "../lib/secureStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      if (!refreshToken) {
        console.log("Refresh token yok");
        return false;
      }

      console.log("Token yenileme başlatılıyor...");
      
      const response = await fetch("http://10.0.2.2:3000/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();
      console.log("Token yenileme response:", data);

      if (response.ok && data.accessToken) {
  
        if (typeof data.accessToken !== 'string') {
          console.error("Geçersiz access token response:", data.accessToken);
          return false;
        }
        
        await saveToken(data.accessToken);
        
        if (data.refreshToken) {
          if (typeof data.refreshToken !== 'string') {
            console.error("Geçersiz refresh token response:", data.refreshToken);
          } else {
            await saveRefreshToken(data.refreshToken);
          }
        }
        
        setToken(data.accessToken);
        console.log("Token başarıyla yenilendi");
        return true;
      } else {
        console.log("Token yenileme başarısız:", data.message);
        return false;
      }
      
    } catch (error) {
      console.error("Token yenileme hatası:", error);

      return false;
    }
  };

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const storedToken = await getToken();
      
      if (storedToken) {
        console.log("Stored token bulundu, kontrol ediliyor...");
        if (isTokenValid(storedToken)) {
          console.log("Token geçerli");
          setToken(storedToken);
        } else {
          console.log("Token süresi dolmuş, yenileme deneniyor...");
          const refreshed = await refreshTokens();
          if (!refreshed) {
            console.log("Token yenileme başarısız, logout yapılıyor");
            await logout();
          }
        }
      } else {
        console.log("Stored token bulunamadı");
      }
      
      setIsLoading(false);
    };

    checkAndRefreshToken();
  }, []);

  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      if (!isTokenValid(token)) {
        console.log("Token süresi dolmuş, otomatik yenileme...");
        const refreshed = await refreshTokens();
        if (!refreshed) {
          console.log("Otomatik token yenileme başarısız");
     
        }
      }
    }, 10 * 60 * 1000); 

    return () => clearInterval(interval);
  }, [token]);

  const login = async (accessToken: string, refreshToken: string) => {
    console.log("Login fonksiyonu çağrıldı", { 
      accessTokenType: typeof accessToken, 
      refreshTokenType: typeof refreshToken,
      accessTokenLength: accessToken?.length,
      refreshTokenLength: refreshToken?.length
    });
    

    if (!accessToken || typeof accessToken !== 'string') {
      console.error("Geçersiz access token:", accessToken);
      throw new Error("Geçersiz access token");
    }
    
    if (!refreshToken || typeof refreshToken !== 'string') {
      console.error("Geçersiz refresh token:", refreshToken);
      throw new Error("Geçersiz refresh token");
    }
    
    try {
      setToken(accessToken);
      await saveToken(accessToken);
      await saveRefreshToken(refreshToken);
      console.log("Token'lar başarıyla kaydedildi");
    } catch (error) {
      console.error("Token kaydetme hatası:", error);
      throw error;
    }
  };

  const logout = async () => {
    setToken(null);
    await deleteToken();
    await deleteRefreshToken();
    await AsyncStorage.removeItem("user");
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
