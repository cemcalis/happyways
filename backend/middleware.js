import jwt from "jsonwebtoken";
import { loadEnv } from "./utils/env.js";

loadEnv();
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ 
      success: false,
      message: "Token bulunamadı." 
    });
  }

  const token = authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Token eksik." 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        success: false,
        message: "Token geçersiz." 
      });
    }

    req.user = decoded; 
    next(); 
  });
};

export default authenticateToken;
export { authenticateToken as verifyToken };
