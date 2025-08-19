const fs = require('fs').promises;
const path = require('path');

const VOCAB_PATH = path.join(__dirname, '../state/vocabulary.json');

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

async function updateRating(word, delta) {
  try {
    const data = await fs.readFile(VOCAB_PATH, 'utf-8');
    const words = JSON.parse(data);

    const index = words.findIndex(item => item.word === word);
    if (index === -1) {
      console.warn(`⚠️ Слово "${word}" не найдено в словаре.`);
      return;
    }

    const current = words[index].rating ?? 0;
    const next = clamp(current + delta, 0, 5);

    if (next !== current) {
      words[index].rating = next;
      words[index].date = new Date().toISOString();
      await fs.writeFile(VOCAB_PATH, JSON.stringify(words, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Ошибка при обновлении рейтинга:', err);
  }
}

module.exports = { updateRating };