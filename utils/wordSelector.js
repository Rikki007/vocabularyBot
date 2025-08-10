const { fetchVocabulary } = require('../services/sheets');

async function generateQuiz(msg) {
    const words = await fetchVocabulary();
    const cleanWords = words.filter(item => item.Word?.trim() && item.Translation.trim());

    const correct = cleanWords[Math.floor(Math.random() * cleanWords.length)];

    const distractors = cleanWords
        .filter(item => item.Translation !== correct.Translation)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    const options = [...distractors, correct].sort(() => 0.5 * Math.random());

    const buttons = options.map(opt => [{
        text: opt.Translation,
        callback_data: opt.Translation === correct.Translation ? 'correct' : 'wrong'
    }]);

    return {
        text: `❓ Что означает слово: *${correct.Word}*`,
        options: {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: buttons
            }
        },
        correctWord: correct.Word
    };
}

module.exports = { generateQuiz };