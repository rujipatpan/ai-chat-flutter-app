# 🤖 AI Chat Flutter App

Mobile application สำหรับถามตอบ AI ด้วย Flutter พร้อม REST API ที่รองรับ **OpenAI GPT-3.5** และ **Claude 3 Haiku** พร้อม **Smart Fallback System**

![Flutter](https://img.shields.io/badge/Flutter-3.10+-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5--Turbo-orange.svg)
![Claude](https://img.shields.io/badge/Claude-3--Haiku-purple.svg)

## ✨ Features

- 🤖 **Multi-AI Support**: เลือกใช้ OpenAI GPT-3.5, Claude 3 Haiku หรือ Mock AI
- 🔄 **Smart Fallback**: อัตโนมัติเปลี่ยน provider เมื่อมีปัญหา
- 💬 **Real-time Chat**: แชทแบบ real-time พร้อม typing indicators
- 🎨 **Modern UI**: Material Design 3 ที่สวยงามและใช้งานง่าย
- 📱 **Responsive Design**: ทำงานได้ทุกขนาดหน้าจอ
- 🌐 **Thai Language**: รองรับภาษาไทยเต็มรูปแบบ
- ⚡ **Error Resilient**: จัดการ quota, rate limit และ error ได้อย่างชาญฉลาด

## 🚨 แก้ไขปัญหา OpenAI Quota หมด

หาก OpenAI API แสดง error **\"insufficient_quota\"**:

### 🔧 วิธีแก้ไขด่วน (3 ทางเลือก):

#### 1. **เปลี่ยนไปใช้ Claude** (แนะนำ - ถูกกว่า 5-6 เท่า!)
```bash
# แก้ไขไฟล์ api_server/.env
AI_PROVIDER=claude
CLAUDE_API_KEY=your-claude-api-key-here
```

#### 2. **ใช้ Mock AI** (สำหรับทดสอบ)
```bash
# แก้ไขไฟล์ api_server/.env
AI_PROVIDER=mock
```

#### 3. **เติมเงิน OpenAI**
- ไปที่ https://platform.openai.com/account/billing
- เพิ่ม payment method และเติม credits

📚 **คู่มือแก้ไขปัญหาแบบละเอียด**: [API_TROUBLESHOOTING.md](API_TROUBLESHOOTING.md)

## 🔄 Smart Fallback System

แอปจะพยายามใช้ AI ตามลำดับนี้:
```
Primary Provider (ที่เลือก) → Fallback Provider → Mock AI
```

ตัวอย่าง:
- OpenAI (quota หมด) → Claude → Mock AI ✅
- Claude (API key ผิด) → OpenAI → Mock AI ✅

## 🚀 การติดตั้งและใช้งาน

### 1. Clone โปรเจ็ค

```bash
git clone https://github.com/rujipatpan/ai-chat-flutter-app.git
cd ai-chat-flutter-app
```

### 2. ตั้งค่า API Backend

```bash
cd api_server
npm install
```

**สร้างไฟล์ .env:**
```bash
cp .env.example .env
```

**แก้ไขไฟล์ .env:** (เลือกอย่างใดอย่างหนึ่ง)

**💡 แนะนำ: เริ่มต้นด้วย Claude (ถูกกว่า + เสถียร)**
```env
AI_PROVIDER=claude
CLAUDE_API_KEY=your-claude-api-key-here
```

**หรือใช้ OpenAI:**
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**หรือใช้ Mock สำหรับทดสอบ:**
```env
AI_PROVIDER=mock
```

**เริ่มต้น server:**
```bash
npm start
```

### 3. ตั้งค่า Flutter App

```bash
cd ../flutter_app
flutter pub get
flutter run
```

## 🔑 การได้ API Keys (ฟรี!)

### 🆓 Claude API Key (แนะนำ!)
1. 📝 สมัครที่ https://console.anthropic.com/
2. 🎁 ได้ $5 free credits ทันที
3. 🔑 สร้าง API key ใหม่
4. 📋 คัดลอกใส่ในไฟล์ .env

**ข้อดี Claude:**
- ⚡ เร็วกว่า OpenAI
- 💰 ถูกกว่า 5-6 เท่า
- 🛡️ ปลอดภัยกว่า
- 🇹🇭 รองรับภาษาไทยได้ดี

### OpenAI API Key
1. 📝 สมัครที่ https://platform.openai.com/api-keys
2. 🎁 ได้ $5 free credits
3. 🔑 สร้าง API key ใหม่

## 💰 เปรียบเทียบค่าใช้จ่าย

| Provider | ราคา (1K tokens) | Free Credits | ความเร็ว |
|----------|------------------|--------------|-----------|
| **Claude 3 Haiku** | $0.00025-0.00125 | $5 | ⚡⚡⚡ |
| OpenAI GPT-3.5 | $0.0015-0.002 | $5 | ⚡⚡ |
| Mock AI | ฟรี | ไม่จำกัด | ⚡⚡⚡⚡ |

**สรุป: Claude ถูกที่สุดและเร็วที่สุด!** 🏆

## 📱 การใช้งาน App

1. **เปิดแอป**: จะแสดงหน้าแชทสวยๆ
2. **เลือก AI**: คลิก 🧠 เพื่อเลือก provider
3. **เริ่มแชท**: พิมพ์ข้อความและส่ง
4. **เปลี่ยน AI**: สลับได้ตลอดเวลา

### 🎯 UI Features:
- 💬 **Chat Bubbles**: แบบ iMessage สวยๆ
- ⏳ **Typing Indicator**: จุดกระพริบขณะ AI คิด
- 🔄 **Provider Status**: แสดงสถานะ AI ปัจจুบัน
- 🌐 **Server Status**: ไฟแสดงสถานะการเชื่อมต่อ
- 🧹 **Clear Chat**: ลบประวัติการสนทนา

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | ส่งข้อความ + เลือก provider |
| `GET` | `/api/providers` | ดู AI providers ที่พร้อมใช้ |
| `GET` | `/api/status` | ดูสถานะ server และ API keys |
| `GET` | `/api/health` | Health check endpoint |

### ตัวอย่างการใช้งาน:

```bash
# ส่งข้อความไปยัง Claude
curl -X POST http://localhost:3000/api/chat \
  -H \"Content-Type: application/json\" \
  -d '{\"message\": \"สวัสดีครับ\", \"provider\": \"claude\"}'

# ดู providers ที่พร้อมใช้
curl http://localhost:3000/api/providers

# ตรวจสอบสถานะ
curl http://localhost:3000/api/status
```

## 🛠️ การแก้ไขปัญหา

### ❌ Server ไม่เชื่อมต่อ
```bash
# ตรวจสอบว่า server ทำงานแล้ว
cd api_server && npm start
```

### ❌ AI ไม่ตอบ
1. ตรวจสอบ API key ในไฟล์ .env
2. ดู console logs เพื่อหา error
3. ลองเปลี่ยน provider ใน UI

### ❌ Flutter ไม่ build
```bash
cd flutter_app
flutter clean
flutter pub get
flutter run
```

### ❌ CORS Error
แก้ไขใน `api_server/server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://10.0.2.2:3000'], // Android emulator
  credentials: true
}));
```

## 🧪 การทดสอบ

### ทดสอบ Backend:
```bash
cd api_server
npm test                          # รัน tests
curl http://localhost:3000/api/health    # Health check
```

### ทดสอบ Flutter:
```bash
cd flutter_app
flutter test
flutter analyze
```

## 🚀 การ Deploy

### Backend (Node.js):
- **Heroku**: ฟรี tier
- **Railway**: ฟรี $5/เดือน
- **Render**: ฟรี tier

### Frontend (Flutter):
- **Web**: `flutter build web`
- **Android**: `flutter build apk`
- **iOS**: `flutter build ios`

## 📂 โครงสร้างโปรเจ็ค

```
ai-chat-flutter-app/
├── 📱 flutter_app/              # Flutter mobile app
│   ├── lib/
│   │   ├── main.dart           # App entry point
│   │   ├── models/             # Data models
│   │   ├── screens/            # UI screens
│   │   ├── services/           # API services
│   │   └── widgets/            # Reusable widgets
│   └── pubspec.yaml
├── 🖥️ api_server/               # Node.js backend
│   ├── server.js              # Main server
│   ├── routes/chat.js         # AI API routes
│   ├── package.json
│   └── .env                   # API keys
├── 📚 README.md               # คู่มือนี้
└── 🔧 API_TROUBLESHOOTING.md # คู่มือแก้ปัญหา
```

## 🤝 Contributing

1. Fork โปรเจ็ค
2. สร้าง feature branch
3. Commit และ push
4. เปิด Pull Request

## 📄 License

MIT License - ใช้ฟรี สำหรับทุกโปรเจ็ค!

## 👨‍💻 Author

สร้างด้วย ❤️ โดย [rujipatpan](https://github.com/rujipatpan)

---

## 🌟 หากชอบโปรเจ็คนี้

⭐ **กด Star ให้ด้วยนะครับ!** ⭐

📢 **แชร์ให้เพื่อนๆ ได้ใช้กัน!**

🐛 **พบ Bug หรือมีข้อเสนอแนะ**: เปิด Issue ได้เลย!

---

### 🎉 Happy Coding! สนุกกับการสร้าง AI Chat App! 🚀