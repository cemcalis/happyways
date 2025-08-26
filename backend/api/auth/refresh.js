import express from "express";
import jwt from "jsonwebtoken";
import { getDB } from "../../database/db.js";

const router = express.Router();

export const generateRefreshToken = async (userId) => {
  const refreshToken = jwt.sign(
    { userId, tokenType: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );


  try {
    const db = getDB();
    await db.run(
      "INSERT OR REPLACE INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [userId, refreshToken, Date.now() + (7 * 24 * 60 * 60 * 1000)]
    );
  } catch (error) {
    console.error("Refresh token kaydetme hatası:", error);
  }
  
  return refreshToken;
};

router.post("/", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token gerekli" });
    }

  
    const db = getDB();
    const tokenRecord = await db.get(
      "SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > ?",
      [refreshToken, Date.now()]
    );

    if (!tokenRecord) {
      return res.status(401).json({ message: "Geçersiz veya süresi dolmuş refresh token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (error) {
  
      await db.run("DELETE FROM refresh_tokens WHERE token = ?", [refreshToken]);
      return res.status(401).json({ message: "Geçersiz refresh token" });
    }

    const user = await db.get("SELECT * FROM users WHERE id = ?", [decoded.userId]);
    
    if (!user) {
      await db.run("DELETE FROM refresh_tokens WHERE token = ?", [refreshToken]);
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    const newAccessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" } 
    );

    const newRefreshToken = await generateRefreshToken(user.id);
    
    await db.run("DELETE FROM refresh_tokens WHERE token = ?", [refreshToken]);

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

router.delete("/", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      const db = getDB();
      await db.run("DELETE FROM refresh_tokens WHERE token = ?", [refreshToken]);
    }
    
    res.status(200).json({ message: "Refresh token geçersiz kılındı" });
  } catch (error) {
    console.error("Refresh token silme hatası:", error);
    res.status(500).json({ message: "Hata oluştu" });
  }
});

export default router;
