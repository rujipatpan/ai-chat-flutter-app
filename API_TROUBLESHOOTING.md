# 🔧 แก้ไขปัญหา API Quota และ Error Handling

## 🚫 ปัญหา OpenAI Quota หมด

### สาเหตุ
- OpenAI ให้ free credits จำนวนจำกัด
- Credits หมดหรือเกิน rate limit
- API key ไม่มีสิทธิ์เพียงพอ

### วิธีแก้ไข

#### 1. ตรวจสอบ Quota ใน OpenAI Dashboard
```bash
# ไปที่ https://platform.openai.com/usage
# ดู Current usage และ Available credits
```

#### 2. เปลี่ยนไปใช้ Claude API แทน
```bash
# แก้ไขไฟล์ .env
AI_PROVIDER=claude
CLAUDE_API_KEY=your-claude-api-key-here
```

#### 3. ใช้ Mock AI สำหรับทดสอบ
```bash
# แก้ไขไฟล์ .env
AI_PROVIDER=mock
```

#### 4. เติมเงินใน OpenAI (หากต้องการใช้ต่อ)
- ไปที่ https://platform.openai.com/account/billing
- เพิ่ม payment method
- เติม credits

## 🔄 Smart Fallback System

แอปของเราใช้ระบบ **Smart Fallback** ที่จะ:

1. **ลอง Primary Provider** (ที่เลือกไว้)
2. **ลอง Secondary Provider** (หาก Primary ล้มเหลว)
3. **ใช้ Mock AI** (หากทุก API ล้มเหลว)

### ตัวอย่างการทำงาน:
```
OpenAI (quota หมด) → Claude → Mock AI
Claude (API key ผิด) → OpenAI → Mock AI
```

## 🆓 ทางเลือก Free APIs

### 1. Claude API (Anthropic)
- **Free tier**: $5 credits เมื่อสมัครใหม่
- **ราคา**: ถูกกว่า OpenAI
- **ได้จาก**: https://console.anthropic.com/

### 2. Gemini API (Google)
- **Free tier**: 15 requests/minute
- **ได้จาก**: https://ai.google.dev/

### 3. Ollama (Local AI)
- **ฟรี**: ทำงานบนเครื่องตัวเอง
- **ได้จาก**: https://ollama.ai/

## ⚙️ การตั้งค่า Environment Variables

### สำหรับ Production
```env
# ใช้ Claude เป็นหลัก (ถูกกว่า)
AI_PROVIDER=claude
CLAUDE_API_KEY=your-claude-key
OPENAI_API_KEY=your-openai-key  # สำหรับ fallback
```

### สำหรับ Development
```env
# ใช้ Mock สำหรับทดสอบ
AI_PROVIDER=mock
# หรือ
AI_PROVIDER=claude
CLAUDE_API_KEY=your-claude-key
```

## 🔍 การตรวจสอบสถานะ API

### 1. ผ่าน API Endpoint
```bash
curl http://localhost:3000/api/providers
```

### 2. ผ่าน Flutter App
- ดูไอคอน server status (🟢/🔴)
- ดูสถานะ provider ใน settings

### 3. ผ่าน Server Logs
```bash
# ดู logs ของ Node.js server
npm start
# หรือ
node server.js
```

## 💡 Tips สำหรับการใช้งาน

### 1. จัดการ Rate Limiting
```javascript
// ใน production ควรเพิ่ม rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/chat', limiter);
```

### 2. Cache Response
```javascript
// เก็บ cache สำหรับคำถามที่ซ้ำ
const cache = new Map();

if (cache.has(message)) {
  return cache.get(message);
}

const response = await getAIResponse(message);
cache.set(message, response);
```

### 3. Monitoring Usage
```javascript
// ติดตาม API usage
let apiCallCount = 0;
let dailyUsage = 0;

router.post('/chat', async (req, res) => {
  apiCallCount++;
  console.log(`API calls today: ${apiCallCount}`);
  // ... rest of the code
});
```

## 🚨 Error Messages และการแก้ไข

### \"insufficient_quota\"
```
แก้ไข: เติมเงินใน OpenAI หรือเปลี่ยนไปใช้ Claude
```

### \"invalid_api_key\"
```
แก้ไข: ตรวจสอบ API key ในไฟล์ .env
```

### \"rate_limit_exceeded\"
```
แก้ไข: รอสักครู่แล้วลองใหม่ หรือเปลี่ยน provider
```

### \"Connection timeout\"
```
แก้ไข: ตรวจสอบอินเทอร์เน็ต หรือเปลี่ยน provider
```

## 📱 การใช้งานในแอป

### เปลี่ยน AI Provider
1. คลิกไอคอน 🧠 ในแถบด้านบน
2. เลือก provider ที่ต้องการ
3. provider ที่ไม่สามารถใช้งานได้จะแสดงไอคอน 🔒

### ดูสถานะการเชื่อมต่อ
- ไอคอน 🟢 = server online
- ไอคอน 🔴 = server offline
- ข้อความแจ้งเตือนด้านบน = API มีปัญหา

## 🎯 Best Practices

1. **ใช้ Claude เป็น Primary** (ถูกกว่าและเสถียร)
2. **เก็บ OpenAI เป็น Fallback** (กรณีฉุกเฉิน)
3. **ใช้ Mock AI สำหรับ Development** (ประหยัด quota)
4. **Monitor Usage** (ติดตาม API calls)
5. **Set Rate Limits** (ป้องกันการใช้งานเกิน)

## 💰 เปรียบเทียบค่าใช้จ่าย (อัปเดต 2025)

| Provider | Input (1K tokens) | Output (1K tokens) | Free Tier |
|----------|-------------------|--------------------|-----------| 
| OpenAI GPT-3.5 | $0.0015 | $0.002 | $5 credits |
| Claude 3 Haiku | $0.00025 | $0.00125 | $5 credits |
| Mock AI | $0 | $0 | ไม่จำกัด |

**สรุป**: Claude ถูกกว่า OpenAI ประมาณ 5-6 เท่า! 💸