const express = require('express');
const router = express.Router();

// Simple AI responses for demonstration
const aiResponses = [
  'สวัสดีครับ! มีอะไรให้ผมช่วยไหมครับ?',
  'นั่นเป็นคำถามที่น่าสนใจมากเลยครับ ให้ผมคิดดูสักครู่...',
  'ขอบคุณสำหรับคำถามครับ ผมจะพยายามตอบให้ดีที่สุด',
  'ผมเข้าใจแล้วครับ นี่คือสิ่งที่ผมคิดว่าจะช่วยคุณได้',
  'น่าสนใจมากครับ! ให้ผมอธิบายให้ฟังนะครับ',
  'คำถามที่ดีมากครับ ผมมีข้อมูลที่น่าจะเป็นประโยชน์',
];

// Function to simulate AI processing
const generateAIResponse = (userMessage) => {
  // Simple keyword-based responses
  const message = userMessage.toLowerCase();
  
  if (message.includes('สวัสดี') || message.includes('หวัดดี') || message.includes('hello')) {
    return 'สวัสดีครับ! ยินดีที่ได้รู้จักนะครับ มีอะไรให้ช่วยไหมครับ?';
  }
  
  if (message.includes('ชื่อ')) {
    return 'ผมชื่อ AI Assistant ครับ เป็น AI ที่ถูกสร้างมาเพื่อช่วยเหลือและตอบคำถามต่างๆ';
  }
  
  if (message.includes('อย่างไร') || message.includes('ทำไง')) {
    return 'เรื่องนี้มีหลายวิธีครับ ขึ้นอยู่กับสถานการณ์ของคุณ คุณต้องการคำแนะนำด้านไหนครับ?';
  }
  
  if (message.includes('ค่าใช้จ่าย') || message.includes('ราคา') || message.includes('เงิน')) {
    return 'เรื่องการเงินเป็นเรื่องสำคัญครับ ควรวางแผนการเงินและติดตามรายรับรายจ่ายให้ดี';
  }
  
  if (message.includes('เวลา') || message.includes('กี่โมง')) {
    const now = new Date();
    return `ตอนนี้เวลา ${now.toLocaleTimeString('th-TH')} ครับ`;
  }
  
  if (message.includes('ขอบคุณ') || message.includes('thank you')) {
    return 'ยินดีครับ! หากมีคำถามอื่นๆ อีก สามารถถามได้เสมอนะครับ';
  }
  
  if (message.includes('ลาก่อน') || message.includes('bye')) {
    return 'ลาก่อนครับ! หวังว่าจะได้พูดคุยกันอีกนะครับ';
  }
  
  // Random response for other messages
  const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
  return `${randomResponse} เกี่ยวกับ "${userMessage}" นั่นเอง`;
};

// POST /api/chat - Send message to AI
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Message is required and must be a non-empty string'
      });
    }
    
    // Simulate processing time (0.5-2 seconds)
    const processingTime = Math.random() * 1500 + 500;
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    // Generate AI response
    const aiResponse = generateAIResponse(message.trim());
    
    // Return response
    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString(),
      processingTime: Math.round(processingTime)
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process chat message'
    });
  }
});

// GET /api/chat/history - Get chat history (placeholder)
router.get('/chat/history', (req, res) => {
  res.json({
    message: 'Chat history feature not implemented yet',
    history: []
  });
});

module.exports = router;