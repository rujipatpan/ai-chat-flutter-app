const express = require('express');
const router = express.Router();
const axios = require('axios');

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Claude API configuration  
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

// Default AI provider (can be 'openai', 'claude', or 'mock')
const DEFAULT_AI_PROVIDER = process.env.AI_PROVIDER || 'mock';

// Simple AI responses for demonstration (fallback)
const aiResponses = [
  'สวัสดีครับ! มีอะไรให้ผมช่วยไหมครับ?',
  'นั่นเป็นคำถามที่น่าสนใจมากเลยครับ ให้ผมคิดดูสักครู่...',
  'ขอบคุณสำหรับคำถามครับ ผมจะพยายามตอบให้ดีที่สุด',
  'ผมเข้าใจแล้วครับ นี่คือสิ่งที่ผมคิดว่าจะช่วยคุณได้',
  'น่าสนใจมากครับ! ให้ผมอธิบายให้ฟังนะครับ',
  'คำถามที่ดีมากครับ ผมมีข้อมูลที่น่าจะเป็นประโยชน์',
];

// Function to call OpenAI API
async function callOpenAI(message) {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await axios.post(OPENAI_API_URL, {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'คุณคือ AI Assistant ที่เป็นมิตรและช่วยเหลือ ตอบเป็นภาษาไทยให้สุภาพและเป็นธรรมชาติ'
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    throw new Error('Failed to get response from OpenAI');
  }
}

// Function to call Claude API
async function callClaude(message) {
  try {
    if (!CLAUDE_API_KEY) {
      throw new Error('Claude API key not configured');
    }

    const response = await axios.post(CLAUDE_API_URL, {
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `คุณคือ AI Assistant ที่เป็นมิตรและช่วยเหลือ ตอบเป็นภาษาไทยให้สุภาพและเป็นธรรมชาติ\n\nคำถาม: ${message}`
        }
      ]
    }, {
      headers: {
        'x-api-key': CLAUDE_API_KEY,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      }
    });

    return response.data.content[0].text;
  } catch (error) {
    console.error('Claude API Error:', error.response?.data || error.message);
    throw new Error('Failed to get response from Claude');
  }
}

// Function to simulate AI processing (fallback)
const generateMockAIResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  if (message.includes('สวัสดี') || message.includes('หวัดดี') || message.includes('hello')) {
    return 'สวัสดีครับ! ยินดีที่ได้รู้จักนะครับ มีอะไรให้ช่วยไหมครับ?';
  }
  
  if (message.includes('ชื่อ')) {
    return 'ผมชื่อ AI Assistant ครับ เป็น AI ที่ถูกสร้างมาเพื่อช่วยเหลือและตอบคำถามต่างๆ';
  }
  
  if (message.includes('อย่างไร') || message.includes('ทำไง')) {
    return 'เรื่องนี้มีหลายวิธีครับ ขึ้นอยู่กับสถานการณ์ของคุณ คุณต้องการคำแนะนำเฉพาะด้านไหนครับ?';
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

// Main function to get AI response
async function getAIResponse(message, provider = DEFAULT_AI_PROVIDER) {
  try {
    switch (provider) {
      case 'openai':
        return await callOpenAI(message);
      case 'claude':
        return await callClaude(message);
      case 'mock':
      default:
        return generateMockAIResponse(message);
    }
  } catch (error) {
    console.error(`AI Provider (${provider}) Error:`, error.message);
    // Fallback to mock response if AI APIs fail
    return generateMockAIResponse(message);
  }
}

// POST /api/chat - Send message to AI
router.post('/chat', async (req, res) => {
  try {
    const { message, provider } = req.body;
    
    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Message is required and must be a non-empty string'
      });
    }
    
    // Validate provider if specified
    const validProviders = ['openai', 'claude', 'mock'];
    const selectedProvider = provider && validProviders.includes(provider) ? provider : DEFAULT_AI_PROVIDER;
    
    console.log(`Processing message with provider: ${selectedProvider}`);
    
    const startTime = Date.now();
    
    // Get AI response
    const aiResponse = await getAIResponse(message.trim(), selectedProvider);
    
    const processingTime = Date.now() - startTime;
    
    // Return response
    res.json({
      success: true,
      response: aiResponse,
      provider: selectedProvider,
      timestamp: new Date().toISOString(),
      processingTime: processingTime
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process chat message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/providers - Get available AI providers
router.get('/providers', (req, res) => {
  const providers = [
    {
      id: 'openai',
      name: 'OpenAI GPT-3.5',
      available: !!OPENAI_API_KEY,
      description: 'OpenAI GPT-3.5 Turbo model'
    },
    {
      id: 'claude',
      name: 'Claude 3 Haiku',
      available: !!CLAUDE_API_KEY,
      description: 'Anthropic Claude 3 Haiku model'
    },
    {
      id: 'mock',
      name: 'Mock AI',
      available: true,
      description: 'Simple rule-based responses for testing'
    }
  ];
  
  res.json({
    success: true,
    providers: providers,
    default: DEFAULT_AI_PROVIDER
  });
});

// GET /api/chat/history - Get chat history (placeholder)
router.get('/chat/history', (req, res) => {
  res.json({
    message: 'Chat history feature not implemented yet',
    history: []
  });
});

module.exports = router;