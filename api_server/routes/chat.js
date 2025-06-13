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

// Enhanced AI responses for demonstration (fallback)
const aiResponses = [
  'สวัสดีครับ! มีอะไรให้ผมช่วยไหมครับ?',
  'นั่นเป็นคำถามที่น่าสนใจมากเลยครับ ให้ผมคิดดูสักครู่...',
  'ขอบคุณสำหรับคำถามครับ ผมจะพยายามตอบให้ดีที่สุด',
  'ผมเข้าใจแล้วครับ นี่คือสิ่งที่ผมคิดว่าจะช่วยคุณได้',
  'น่าสนใจมากครับ! ให้ผมอธิบายให้ฟังนะครับ',
  'คำถามที่ดีมากครับ ผมมีข้อมูลที่น่าจะเป็นประโยชน์',
  'เรื่องนี้มีหลายมุมมองนะครับ ลองมาดูกันว่า...',
  'ขอแนะนำให้พิจารณาจากหลายๆ ด้านครับ',
];

// Enhanced conversational responses
const contextualResponses = {
  programming: [
    'การเขียนโปรแกรมเป็นศิลปะที่ต้องฝึกฝนครับ ลองเริ่มจากพื้นฐานก่อน',
    'ปัญหานี้แก้ได้หลายวิธี ขอแนะนำให้ลองแบบง่ายๆ ก่อนครับ',
    'debugging เป็นทักษะสำคัญมาก ลองใช้ console.log หรือ print เพื่อตรวจสอบค่าดูครับ'
  ],
  general: [
    'เรื่องนี้ขึ้นอยู่กับหลายปัจจัยครับ บอกรายละเอียดเพิ่มเติมได้ไหม?',
    'แต่ละคนมีความเห็นที่แตกต่างกันครับ สิ่งสำคัญคือการเปิดใจรับฟัง',
    'การเรียนรู้สิ่งใหม่ๆ เป็นเรื่องดีเสมอครับ ลองค้นคว้าข้อมูลเพิ่มเติมดู'
  ],
  help: [
    'ผมยินดีช่วยเหลือครับ! อธิบายปัญหาให้ละเอียดหน่อยได้ไหม?',
    'มีหลายวิธีที่จะช่วยแก้ปัญหานี้ได้ครับ ลองมาดูกัน',
    'ไม่ต้องกังวลครับ เราจะหาทางแก้ไขร่วมกัน'
  ]
};

// Function to call OpenAI API with better error handling
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
          content: 'คุณคือ AI Assistant ที่เป็นมิตรและช่วยเหลือ ตอบเป็นภาษาไทยให้สุภาพและเป็นธรรมชาติ ถ้าไม่แน่ใจให้บอกตรงๆ และแนะนำให้หาข้อมูลเพิ่มเติม'
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
      },
      timeout: 30000 // 30 second timeout
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    
    // Handle specific OpenAI errors
    if (error.response?.data?.error) {
      const errorCode = error.response.data.error.code;
      const errorType = error.response.data.error.type;
      
      if (errorCode === 'insufficient_quota' || errorType === 'insufficient_quota') {
        throw new Error('OpenAI quota exceeded. กรุณาเติม credits หรือเปลี่ยนไปใช้ Claude/Mock AI แทน');
      } else if (errorCode === 'invalid_api_key') {
        throw new Error('OpenAI API key ไม่ถูกต้อง กรุณาตรวจสอบการตั้งค่า');
      } else if (errorCode === 'rate_limit_exceeded') {
        throw new Error('OpenAI rate limit exceeded กรุณารอสักครู่แล้วลองใหม่');
      }
    }
    
    throw new Error(`OpenAI API error: ${error.response?.data?.error?.message || error.message}`);
  }
}

// Function to call Claude API with better error handling
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
          content: `คุณคือ AI Assistant ที่เป็นมิตรและช่วยเหลือ ตอบเป็นภาษาไทยให้สุภาพและเป็นธรรมชาติ ถ้าไม่แน่ใจให้บอกตรงๆ และแนะนำให้หาข้อมูลเพิ่มเติม

คำถาม: ${message}`
        }
      ]
    }, {
      headers: {
        'x-api-key': CLAUDE_API_KEY,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      timeout: 30000 // 30 second timeout
    });

    return response.data.content[0].text;
  } catch (error) {
    console.error('Claude API Error:', error.response?.data || error.message);
    
    // Handle specific Claude errors
    if (error.response?.status === 401) {
      throw new Error('Claude API key ไม่ถูกต้อง กรุณาตรวจสอบการตั้งค่า');
    } else if (error.response?.status === 429) {
      throw new Error('Claude rate limit exceeded กรุณารอสักครู่แล้วลองใหม่');
    }
    
    throw new Error(`Claude API error: ${error.response?.data?.error?.message || error.message}`);
  }
}

// Enhanced function to simulate AI processing (fallback)
const generateMockAIResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  // Greeting responses
  if (message.includes('สวัสดี') || message.includes('หวัดดี') || message.includes('hello') || message.includes('hi')) {
    return 'สวัสดีครับ! ยินดีที่ได้รู้จักนะครับ ผมเป็น Mock AI Assistant ที่พร้อมช่วยเหลือคุณ มีอะไรให้ช่วยไหมครับ?';
  }
  
  // Identity responses
  if (message.includes('ชื่อ') || message.includes('เป็นใคร')) {
    return 'ผมชื่อ Mock AI Assistant ครับ เป็น AI จำลองที่ถูกสร้างมาเพื่อให้บริการทดสอบระบบ แม้จะไม่ได้เชื่อมต่อกับ AI จริงแต่ผมก็พยายามตอบคำถามให้ดีที่สุดครับ';
  }
  
  // Programming related
  if (message.includes('โปรแกรม') || message.includes('code') || message.includes('coding') || message.includes('flutter') || message.includes('dart')) {
    const responses = contextualResponses.programming;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Help requests
  if (message.includes('ช่วย') || message.includes('help') || message.includes('ปัญหา') || message.includes('แก้ไข')) {
    const responses = contextualResponses.help;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // How to questions
  if (message.includes('อย่างไร') || message.includes('ทำไง') || message.includes('วิธี')) {
    return 'เรื่องนี้มีหลายวิธีแก้ครับ ขึ้นอยู่กับสถานการณ์และความต้องการของคุณ คุณสามารถอธิบายรายละเอียดเพิ่มเติมได้ไหม? ผมจะพยายามแนะนำให้เฉพาะเจาะจงมากขึ้น';
  }
  
  // Money/cost related
  if (message.includes('ค่าใช้จ่าย') || message.includes('ราคา') || message.includes('เงิน') || message.includes('แพง')) {
    return 'เรื่องการเงินเป็นเรื่องสำคัญครับ แนะนำให้วางแผนการเงิน เปรียบเทียบราคา และพิจารณาจากคุณภาพและความคุ้มค่าด้วย หากเป็นเรื่อง API ต่างๆ ลองเปรียบเทียบราคาและ quota ของแต่ละผู้ให้บริการดูครับ';
  }
  
  // Time related
  if (message.includes('เวลา') || message.includes('กี่โมง') || message.includes('วันนี้')) {
    const now = new Date();
    return `ตอนนี้เวลา ${now.toLocaleTimeString('th-TH', { timeZone: 'Asia/Bangkok' })} (เวลาประเทศไทย) ครับ`;
  }
  
  // API related questions
  if (message.includes('api') || message.includes('openai') || message.includes('claude') || message.includes('quota')) {
    return 'เรื่อง API มีหลายตัวเลือกครับ หาก OpenAI quota หมด สามารถลองใช้ Claude API หรือ API อื่นๆ ได้ การจัดการ quota และ rate limiting เป็นเรื่องสำคัญในการพัฒนา app ที่ใช้ AI ครับ';
  }
  
  // Thank you responses
  if (message.includes('ขอบคุณ') || message.includes('thank you') || message.includes('thanks')) {
    return 'ยินดีครับ! หากมีคำถามอื่นๆ อีก สามารถถามได้เสมอนะครับ ผมพร้อมช่วยเหลือตลอดเวลา แม้จะเป็นแค่ Mock AI ก็ตาม 😊';
  }
  
  // Goodbye responses
  if (message.includes('ลาก่อน') || message.includes('bye') || message.includes('แล้วเจอกัน')) {
    return 'ลาก่อนครับ! หวังว่าจะได้พูดคุยกันอีกนะครับ ขอให้มีความสุขกับการพัฒนา app และอย่าลืมว่าผมพร้อมช่วยเสมอ 👋';
  }
  
  // Default responses with more context
  const generalResponses = contextualResponses.general;
  const randomGeneral = generalResponses[Math.floor(Math.random() * generalResponses.length)];
  const randomBase = aiResponses[Math.floor(Math.random() * aiResponses.length)];
  
  return `${randomBase} เกี่ยวกับ "${userMessage}" ${randomGeneral}`;
};

// Main function to get AI response with smart fallback
async function getAIResponse(message, provider = DEFAULT_AI_PROVIDER) {
  console.log(`Attempting to use provider: ${provider}`);
  
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
    
    // Smart fallback logic
    if (provider === 'openai' && CLAUDE_API_KEY) {
      console.log('OpenAI failed, trying Claude...');
      try {
        const claudeResponse = await callClaude(message);
        return `[Claude]: ${claudeResponse}`;
      } catch (claudeError) {
        console.error('Claude also failed:', claudeError.message);
      }
    } else if (provider === 'claude' && OPENAI_API_KEY) {
      console.log('Claude failed, trying OpenAI...');
      try {
        const openaiResponse = await callOpenAI(message);
        return `[OpenAI]: ${openaiResponse}`;
      } catch (openaiError) {
        console.error('OpenAI also failed:', openaiError.message);
      }
    }
    
    // Final fallback to mock
    console.log('All AI providers failed, using Mock AI...');
    return `[Mock AI]: ${generateMockAIResponse(message)}\n\n⚠️ หมายเหตุ: AI APIs ไม่สามารถใช้งานได้ในขณะนี้ (${error.message})`;
  }
}

// Enhanced POST /api/chat endpoint
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
    
    console.log(`Processing message: "${message.substring(0, 50)}..." with provider: ${selectedProvider}`);
    
    const startTime = Date.now();
    
    // Get AI response with smart fallback
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

// Enhanced GET /api/providers endpoint
router.get('/providers', async (req, res) => {
  // Test API connectivity
  const testOpenAI = async () => {
    if (!OPENAI_API_KEY) return false;
    try {
      await axios.post(OPENAI_API_URL, {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1
      }, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });
      return true;
    } catch (error) {
      console.log('OpenAI test failed:', error.response?.data?.error?.code || error.message);
      return false;
    }
  };
  
  const testClaude = async () => {
    if (!CLAUDE_API_KEY) return false;
    try {
      await axios.post(CLAUDE_API_URL, {
        model: 'claude-3-haiku-20240307',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'test' }]
      }, {
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        timeout: 5000
      });
      return true;
    } catch (error) {
      console.log('Claude test failed:', error.response?.status || error.message);
      return false;
    }
  };
  
  // Run tests in parallel
  const [openaiAvailable, claudeAvailable] = await Promise.all([
    testOpenAI(),
    testClaude()
  ]);
  
  const providers = [
    {
      id: 'openai',
      name: 'OpenAI GPT-3.5',
      available: openaiAvailable,
      description: openaiAvailable 
        ? 'OpenAI GPT-3.5 Turbo model' 
        : 'ไม่สามารถใช้งานได้ (ตรวจสอบ API key หรือ quota)',
      status: openaiAvailable ? 'ready' : 'unavailable'
    },
    {
      id: 'claude',
      name: 'Claude 3 Haiku',
      available: claudeAvailable,
      description: claudeAvailable 
        ? 'Anthropic Claude 3 Haiku model' 
        : 'ไม่สามารถใช้งานได้ (ตรวจสอบ API key)',
      status: claudeAvailable ? 'ready' : 'unavailable'
    },
    {
      id: 'mock',
      name: 'Mock AI',
      available: true,
      description: 'Simple rule-based responses for testing',
      status: 'ready'
    }
  ];
  
  res.json({
    success: true,
    providers: providers,
    default: DEFAULT_AI_PROVIDER,
    recommendations: {
      primary: openaiAvailable ? 'openai' : (claudeAvailable ? 'claude' : 'mock'),
      fallback: 'mock'
    }
  });
});

// GET /api/status - Get API status
router.get('/status', async (req, res) => {
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    apis: {
      openai: !!OPENAI_API_KEY,
      claude: !!CLAUDE_API_KEY
    },
    defaultProvider: DEFAULT_AI_PROVIDER
  });
});

module.exports = router;