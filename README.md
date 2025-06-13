# AI Chat Flutter App

Mobile application สำหรับถามตอบ AI ด้วย Flutter พร้อม REST API

## โครงสร้างโปรเจ็ค

```
ai-chat-flutter-app/
├── flutter_app/          # Flutter mobile app
│   ├── lib/
│   │   ├── main.dart
│   │   ├── models/
│   │   ├── screens/
│   │   └── services/
│   └── pubspec.yaml
├── api_server/           # Node.js API backend
│   ├── server.js
│   ├── package.json
│   └── routes/
└── README.md
```

## การติดตั้งและใช้งาน

### 1. API Backend (Node.js)

```bash
cd api_server
npm install
npm start
```

API จะทำงานที่ port 3000

### 2. Flutter App

```bash
cd flutter_app
flutter pub get
flutter run
```

## Features

- ✅ Chat interface สำหรับถามตอบ
- ✅ เชื่อมต่อกับ AI API
- ✅ UI/UX ที่เรียบง่ายและใช้งานง่าย
- ✅ แสดงประวัติการสนทนา
- ✅ Loading states และ error handling

## API Endpoints

- `POST /api/chat` - ส่งข้อความและรับคำตอบจาก AI
- `GET /api/health` - ตรวจสอบสถานะ API

## การพัฒนาต่อ

- เพิ่ม authentication
- บันทึกประวัติการสนทนา
- เพิ่ม AI models ต่างๆ
- Push notifications