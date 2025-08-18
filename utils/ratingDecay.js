const fs = require('fs').promises;
const path = require('path');

const VOCAB_PATH = path.join(__dirname, '../state/vocabulary.json');

const DAY_MS = 24 * 60 * 60 * 1000;
const DECAY_DAYS = 2;
const DECAY_STEP = 1;

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

async function ratingTracker() {
  try {
    const raw = await fs.readFile(VOCAB_PATH, 'utf-8');
    const words = JSON.parse(raw);
    const now = Date.now();

    let changed = 0;

    for (const w of words) {
      if (!w.date) {
        w.date = new Date(now).toISOString();
        continue;
      }

      const last = Date.parse(w.date);
      if (Number.isNaN(last)) {
        w.date = new Date(now).toISOString();
        continue;
      }

      const intervals = Math.floor((now - last) / (DECAY_DAYS * DAY_MS));
      if (intervals <= 0) continue;

      const before = w.rating ?? 0;
      const after = clamp(before - intervals * DECAY_STEP, 0, 5);

      if (after !== before) {
        w.rating = after;
        w.date = new Date(now).toISOString();
        changed++;
      }
    }

    if (changed > 0) {
      await fs.writeFile(VOCAB_PATH, JSON.stringify(words, null, 2), 'utf-8');
    }

    return changed;
  } catch (err) {
    console.error('❌ Ошибка в ratingTracker:', err);
    return 0;
  }
}

module.exports = { ratingTracker, DECAY_DAYS, DECAY_STEP };
