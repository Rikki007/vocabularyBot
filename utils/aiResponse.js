const axios = require('axios');
require('dotenv').config();

async function clue(word) {

  const apiKey = process.env.AI_API_KEY;
  const prompt = `Объясни значение английского слова "${word}" на русском так, чтобы пользователь мог догадаться о переводе, но не называй перевод напрямую. Одно короткое предложение или фраза, которая обьяснит это слово.`;

  try {
    const response = await axios.post(
      'https://api.intelligence.io.solutions/api/v1/chat/completions',
      {
        model: "mistralai/Mistral-Large-Instruct-2411",
        messages: [
          { 
            role: "system", 
            content: "Ты помощник по изучению английского языка. Даёшь подсказки к словам, не называя их перевод напрямую."
          },
          { 
            role: "user", 
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 50
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Ошибка генерации:', error.response?.data || error.message);
    throw new Error('Не удалось получить подсказку =,(');
  }
}

module.exports = { clue };