const session = require('../state/sessionState');

async function generateQuiz(msg) {

    const cleanWords = session.vocabularyQueue.filter(item => item.word?.trim() && item.translation.trim());

    const correct = cleanWords.shift();
    session.lastWord = correct;
    session.vocabularyQueue.shift();

    if (!correct) {
        session.quizActive = false;
        return {
        text: '🎉 Квиз завершён! Все слова пройдены.',
        options: {}
        };
    }

    const distractors = cleanWords
        .filter(item => item.translation !== correct.translation)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    const options = [...distractors, correct].sort(() => 0.5 - Math.random());

    const buttons = options.map(opt => [{
        text: opt.translation,
        callback_data: opt.translation === correct.translation ? 'correct' : 'wrong'
    }]);

    return {
        text: `Что означает слово: *${correct.word}*`,
        options: {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: buttons
            }
        },
        correctWordObj: correct
    };
}

module.exports = { generateQuiz };