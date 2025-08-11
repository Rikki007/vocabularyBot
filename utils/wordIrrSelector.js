const { irregularVerbs } = require('../services/irrSheet');

 async function generateIrrQuiz(msg) {

    const correct = irregularVerbs[Math.floor(Math.random() * irregularVerbs.length)];
    const distractors = irregularVerbs
        .filter(item => item.translation !== correct.translation)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    const options = [...distractors, correct].sort(() => 0.5 - Math.random());

    const buttons = options.map(opt => [{
        text: opt.translation,
        callback_data: opt.translation === correct.translation ? 'correctIrr' : 'wrongIrr'
    }]);

    return {
        text: `Перевод глагола: *${correct.infinitive}* - *${correct.past}* - *${correct.participle}*`,
        options: {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: buttons
            }
        },
        correctWord: correct.infinitive,
        correctTranslation: correct.translation
    };
 }

 module.exports = { generateIrrQuiz };