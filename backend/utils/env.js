import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const loadEnv = (envFile = '.env') => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.resolve(__dirname, '..', envFile);
    const content = fs.readFileSync(filePath, 'utf-8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const [key, ...vals] = trimmed.split('=');
      const value = vals.join('=').trim();
      if (key && value) {
        process.env[key.trim()] = value;
      }
    });
  } catch (err) {
    console.error("ENV LOAD ERROR:", err);
  }
};