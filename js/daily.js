function taipeiDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

// 簡單、可重現的字串雜湊；相同日期與相同角色清單會得到相同索引。
function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function getDailyDate() {
  return taipeiDateString();
}

export function getDailyAnswer(monsters, dailyConfig, date = getDailyDate()) {
  if (!monsters.length) throw new Error("目前沒有可供每日挑戰的角色。");
  const fixedId = dailyConfig?.fixedAnswers?.[date];
  if (fixedId) {
    const fixed = monsters.find(m => m.id === fixedId);
    if (fixed) return fixed;
  }
  const ids = monsters.map(m => m.id).sort();
  const index = hashString(`monster-wordle:${date}:${ids.join("|")}`) % monsters.length;
  return monsters[index];
}
