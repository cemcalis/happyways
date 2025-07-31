import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token bulunamadı." });
  }

  const token = authHeader.split(" ")[1]; // "Bearer abc123" → "abc123"

  if (!token) {
    return res.status(401).json({ message: "Token eksik." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token geçersiz." });
    }

    req.user = decoded; // middleware sonrası route'larda kullanıcı bilgisine erişebilirsin
    next(); // Devam et
  });
};
