# Happyways

Happyways, araç kiralama sürecini kolaylaştırmak için geliştirilen bir projedir. Express ile yazılmış bir API ve Expo/React Native tabanlı mobil arayüzden oluşur.

## Amaç
Kullanıcıların kampanyaları görüntüleyip uygun araçları bulmasını, rezervasyon ve ödeme işlemlerini gerçekleştirmesini hedefler.

## Kurulum

### Gereksinimler
- Node.js 18+
- npm
- Expo CLI (mobil uygulama için)

### Backend
```bash
cd backend
npm install
npm start
```
Sunucu varsayılan olarak `http://localhost:3000` adresinde çalışır. Gerekli ortam değişkenlerini `.env` dosyasında tanımlayın.

### Mobil Uygulama
```bash
cd happyways
npm install
npm start
```
Expo arayüzü açıldıktan sonra uygulamayı cihazınızda veya emülatörde çalıştırabilirsiniz.

## Kullanım Örnekleri
Backend API'sinden örnek bir istek:
```bash
curl http://localhost:3000/api/home
```

## Katkıda Bulunma
1. Depoyu forklayın.
2. Yeni bir dal oluşturun: `git checkout -b ozellik/isim`.
3. Değişikliklerinizi yapıp testleri çalıştırın.
4. Commit'lerinizi ekleyip bir Pull Request açın.
