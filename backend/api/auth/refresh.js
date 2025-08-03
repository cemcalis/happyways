// backend/api/auth/refresh.js
import express from "express";
import jwt from "jsonwebtoken";
import { getDB } from "../../database/db.js";

const router = express.Router();

// In-memory refresh token store (production'da Redis kullanılmalı)
const refreshTokens = new Map();

// Refresh token oluştur
export const generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign(
    { userId, tokenType: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  // Refresh token'ı sakla
  refreshTokens.set(refreshToken, {
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 gün
  });
  
  return refreshToken;
};

// Token yenileme endpoint'i
router.post("/", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token gerekli" });
    }

    // Refresh token geçerli mi kontrol et
    if (!refreshTokens.has(refreshToken)) {
      return res.status(401).json({ message: "Geçersiz refresh token" });
    }

    const tokenData = refreshTokens.get(refreshToken);
    
    // Token süresi dolmuş mu kontrol et
    if (Date.now() > tokenData.expiresAt) {
      refreshTokens.delete(refreshToken);
      return res.status(401).json({ message: "Refresh token süresi dolmuş" });
    }

    // JWT geçerliliğini doğrula
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (error) {
      refreshTokens.delete(refreshToken);
      return res.status(401).json({ message: "Geçersiz refresh token" });
    }

    // Kullanıcı var mı kontrol et
    const db = getDB();
    const user = await db.get("SELECT * FROM users WHERE id = ?", [decoded.userId]);
    
    if (!user) {
      refreshTokens.delete(refreshToken);
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    // Yeni access token oluştur
    const newAccessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // 15 dakika
    );

    // Yeni refresh token oluştur (rotation)
    const newRefreshToken = generateRefreshToken(user.id);
    
    // Eski refresh token'ı sil
    refreshTokens.delete(refreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      message: "Token başarıyla yenilendi"
    });

  } catch (error) {
    console.error("Token yenileme hatası:", error);
    res.status(500).json({ 
      message: "Token yenileme işleminde hata oluştu", 
      error: error.message 
    });
  }
});

// Refresh token'ı geçersiz kıl (logout)
router.delete("/", (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken && refreshTokens.has(refreshToken)) {
      refreshTokens.delete(refreshToken);
    }
    
    res.status(200).json({ message: "Refresh token geçersiz kılındı" });
  } catch (error) {
    console.error("Refresh token silme hatası:", error);
    res.status(500).json({ message: "Hata oluştu" });
  }
});

export default router;
