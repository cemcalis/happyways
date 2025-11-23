import logger from "./logger.js";

const resolvedSecret = process.env.JWT_SECRET || "development-fallback-secret";

if (!process.env.JWT_SECRET) {
  logger.warn(
    "JWT_SECRET ortam değişkeni ayarlanmadı. Geliştirme için yedek gizli anahtar kullanılıyor."
  );
}

export const JWT_SECRET = resolvedSecret;
