# 🤖 AI Chat Flutter App

Mobile application สำหรับถามตอบ AI ด้วย Flutter พร้อม REST API ที่รองรับ **OpenAI GPT-3.5** และ **Claude 3 Haiku**

![Flutter](https://img.shields.io/badge/Flutter-3.10+-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5--Turbo-orange.svg)
![Claude](https://img.shields.io/badge/Claude-3--Haiku-purple.svg)

## ✨ Features

- 🤖 **Multi-AI Support**: เลือกใช้ OpenAI GPT-3.5, Claude 3 Haiku หรือ Mock AI
- 💬 **Real-time Chat**: แชทแบบ real-time พร้อม typing indicators
- 🎨 **Modern UI**: Material Design 3 ที่สวยงามและใช้งานง่าย
- 🔄 **Provider Switching**: เปลี่ยน AI provider ได้แบบ real-time
- 📱 **Responsive Design**: ทำงานได้ทุกขนาดหน้าจอ
- 🌐 **Thai Language**: รองรับภาษาไทยเต็มรูปแบบ
- ⚡ **Fast & Reliable**: Error handling และ fallback ที่ครบถ้วน

## 🏗️ โครงสร้างโปรเจ็ค

```
ai-chat-flutter-app/
├── flutter_app/              # Flutter mobile app
│   ├── lib/
│   │   ├── main.dart         # App entry point
│   │   ├── models/           # Data models
│   │   │   ├── message.dart
│   │   │   └── ai_provider.dart
│   │   ├── screens/          # UI screens
│   │   │   └── chat_screen.dart
│   │   ├── services/         # API services
│   │   │   └── chat_service.dart
│   │   └── widgets/          # Reusable widgets
│   │       ├── message_bubble.dart
│   │       ├── message_input.dart
│   │       └── provider_selector.dart
│   └── pubspec.yaml
├── api_server/               # Node.js API backend
│   ├── server.js            # Main server
│   ├── routes/
│   │   └── chat.js          # Chat API with AI integration
│   ├── package.json
│   └── .env.example         # Environment variables template
└── README.md
```

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
nano .env  # หรือใช้ text editor ที่ชอบ
```

**แก้ไขไฟล์ .env:**
```env
# เลือก AI Provider (openai, claude, หรือ mock)
AI_PROVIDER=openai

# OpenAI API Key (ได้จาก https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Claude API Key (ได้จาก https://console.anthropic.com/)
CLAUDE_API_KEY=your-claude-api-key-here
```

**เริ่มต้น server:**
```bash
npm start
```

Server จะทำงานที่ http://localhost:3000

### 3. ตั้งค่า Flutter App

```bash
cd ../flutter_app
flutter pub get
flutter run
```

## 🔑 การได้ API Keys

### OpenAI API Key
1. ไปที่ https://platform.openai.com/api-keys
2. สร้างบัญชีหรือเข้าสู่ระบบ
3. คลิก "Create new secret key"
4. คัดลอก API key ใส่ในไฟล์ .env

### Claude API Key  
1. ไปที่ https://console.anthropic.com/
2. สร้างบัญชีหรือเข้าสู่ระบบ
3. ไปที่ "API Keys" section
4. สร้าง new API key
5. คัดลอก API key ใส่ในไฟล์ .env

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | ส่งข้อความไปยัง AI |
| `GET` | `/api/providers` | ดูรายการ AI providers ที่มี |
| `GET` | `/api/health` | ตรวจสอบสถานะ server |

### ตัวอย่างการใช้งาน API

```bash
# ส่งข้อความไปยัง OpenAI
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "สวัสดีครับ", "provider": "openai"}'

# ดู providers ที่มี
curl http://localhost:3000/api/providers
```

## 📱 การใช้งาน App

1. **เลือก AI Provider**: คลิกที่ไอคอน 🧠 ในแถบด้านบนเพื่อเลือก AI
2. **พิมพ์ข้อความ**: พิมพ์คำถามในช่องด้านล่าง
3. **ส่งข้อความ**: กด Enter หรือคลิกปุ่มส่ง
4. **ดูการตอบ**: รอ AI ตอบกลับ
5. **เปลี่ยน Provider**: เปลี่ยน AI ได้ตามต้องการ

## 🛠️ การพัฒนาต่อ

### เพิ่ม AI Provider ใหม่

1. แก้ไข `api_server/routes/chat.js`
2. เพิ่ม function สำหรับ API ใหม่
3. เพิ่มใน `getAIResponse()` function
4. อัปเดต Flutter UI ใน `provider_selector.dart`

### Features ที่สามารถเพิ่มได้

- ✅ Authentication & User management
- ✅ Chat history persistence
- ✅ File upload support
- ✅ Voice messages
- ✅ Push notifications
- ✅ Multi-language support

## 💰 ค่าใช้จ่าย API

### OpenAI GPT-3.5 Turbo
- **Input**: ~$0.0015 per 1K tokens
- **Output**: ~$0.002 per 1K tokens
- **ประมาณ**: 1 ข้อความ ≈ $0.001-0.01

### Claude 3 Haiku
- **Input**: $0.00025 per 1K tokens  
- **Output**: $0.00125 per 1K tokens
- **ประมาณ**: 1 ข้อความ ≈ $0.0005-0.005

## 🔧 Troubleshooting

### ปัญหาที่พบบ่อย

**1. Server ไม่เชื่อมต่อ**
- ตรวจสอบว่า Node.js server ทำงานที่ port 3000
- ตรวจสอบ CORS settings ใน server.js

**2. AI API ไม่ทำงาน**
- ตรวจสอบ API keys ในไฟล์ .env
- ตรวจสอบ credits/quota ของ API
- ดู logs ใน console สำหรับ error messages

**3. Flutter app ไม่ build**
- รัน `flutter clean && flutter pub get`
- ตรวจสอบ Flutter version (ต้อง 3.10+)

**4. แก้ไขปัญหา CORS**
```javascript
// ในไฟล์ server.js
app.use(cors({
  origin: ['http://localhost:3000', 'http://10.0.2.2:3000'], // สำหรับ Android emulator
  credentials: true
}));
```

## 🧪 การทดสอบ

### ทดสอบ API
```bash
# ทดสอบ health check
curl http://localhost:3000/api/health

# ทดสอบ chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "provider": "mock"}'
```

### ทดสอบ Flutter
```bash
cd flutter_app
flutter test
flutter analyze
```

## 📚 เอกสารเพิ่มเติม

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Claude API Documentation](https://docs.anthropic.com/)
- [Flutter Documentation](https://docs.flutter.dev/)
- [Node.js Express Documentation](https://expressjs.com/)

## 🤝 Contributing

1. Fork โปรเจ็ค
2. สร้าง feature branch (`git checkout -b feature/amazing-feature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add amazing feature'`)
4. Push ไปยัง branch (`git push origin feature/amazing-feature`)
5. เปิด Pull Request

## 📄 License

MIT License - ดูรายละเอียดใน [LICENSE](LICENSE) file

## 👨‍💻 Author

Created with ❤️ by [rujipatpan](https://github.com/rujipatpan)

---

⭐ **ถ้าชอบโปรเจ็คนี้ อย่าลืมกด Star นะครับ!** ⭐