module.exports = (bot) => {
     bot.onText(/\/comands/, async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;
        bot.sendMessage(chatId, `📘 *Доступные команды:* \n/irr — квиз по неправильным глаголам. \n/quiz — квиз по словам из словаря. \n💬 Просто введи слово на английском — бот даст объяснение и перевод.`, { parse_mode: 'Markdown' });
    });
}