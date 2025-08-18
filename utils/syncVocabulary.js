const { fetchVocabulary } = require('../services/sheets');
const { loadVocabulary, saveVocabulary } = require('./vocabularyStore');

function normKey(s) {
    return (s || '').trim().toLowerCase();
}

async function syncVocabulary() {
    const [local, incoming] = await Promise.all([
        loadVocabulary(),
        fetchVocabulary()
    ]);

    const existing = new Set(local.map(w => normKey(w.word)));
    let added = 0;
    const nowISO = new Date().toISOString();

    for (const rec of incoming) {
        const key = normKey(rec.word);
        if (!key) continue;
        if (existing.has(key)) continue;

        local.push({
            word: rec.word.trim(),
            translation: rec.translation.trim(),
            rating: 0,
            date: nowISO
        });
        existing.add(key);
        added++;
    }

    if (added > 0) {
        await saveVocabulary(local);
    }

    return { added, totalBefore: existing.size - added, totalAfter: existing.size };
}

module.exports = { syncVocabulary };