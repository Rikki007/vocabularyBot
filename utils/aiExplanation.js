require('dotenv').config();
const axios = require('axios');

async function explanation(word) {

    const apiKey = process.env.AI_API_KEY;
    const prompt = `Перевод слова "${word}" на русский. Если слова "${word}" не существует в английском языке, напиши "Слово отсутствует в английском языке. Возможно, вы написали его неправильно, попробуйте снова...", если в английском языке слово есть не нужно писать об этом. Ответ краткий и по существу.
    Ответ в форме:
    Перевод слова - ...

    Пример - ...

    Перевод примера - ...`;

    if (!apiKey) {
        console.error('❌ AI_API_KEY не найден в .env');
        return '⚠️ Не удалось получить объяснение.';
    }

    try {
        const response = await axios.post(
            'https://api.intelligence.io.solutions/api/v1/chat/completions',
            {
                model: "mistralai/Mistral-Large-Instruct-2411",
                messages: [
                { 
                    role: "system", 
                    content: "Ты помощник по изучению английского языка."
                },
                { 
                    role: "user", 
                    content: prompt
                }
                ],
                temperature: 0.4,
                max_tokens: 90
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
        throw new Error('Не удалось получить перевод =,(');
    }
}

module.exports = { explanation };