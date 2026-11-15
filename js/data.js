const VALID_ATTRIBUTES = ["火", "水", "木", "光", "闇"];
const VALID_CLASSES = ["平衡型", "力量型", "速度型", "砲擊型"];
const VALID_HIT_TYPES = ["反射", "反射聚能", "貫通", "貫通聚能"];
const VALID_OBTAIN_METHODS = ["限定角色", "普通角色", "掉落角色"];

export async function loadGameData() {
  const [monstersResponse, configResponse, dailyResponse] = await Promise.all([
    fetch("./data/monsters.json"),
    fetch("./data/game-config.json"),
    fetch("./data/daily-config.json")
  ]);
  if (!monstersResponse.ok || !configResponse.ok || !dailyResponse.ok) {
    throw new Error("遊戲資料載入失敗，請確認 JSON 檔案存在且網站是透過 HTTP 開啟。");
  }
  const monsters = await monstersResponse.json();
  const config = await configResponse.json();
  const dailyConfig = await dailyResponse.json();
  validateMonsters(monsters);
  return { monsters, config, dailyConfig };
}

export function validateMonsters(monsters) {
  if (!Array.isArray(monsters)) throw new Error("monsters.json 必須是陣列。");
  const ids = new Set();
  monsters.forEach((m, index) => {
    const label = `第 ${index + 1} 筆角色`;
    for (const key of ["id", "name", "attribute", "race", "class", "hitType", "rarity", "releaseYear", "obtainMethod", "active"]) {
      if (!(key in m)) throw new Error(`${label}缺少欄位：${key}`);
    }
    if (ids.has(m.id)) throw new Error(`${label}的 id 重複：${m.id}`);
    ids.add(m.id);
    if (!VALID_ATTRIBUTES.includes(m.attribute)) throw new Error(`${label}的 attribute 不正確。`);
    if (!Array.isArray(m.race) || m.race.length === 0 || m.race.some(x => typeof x !== "string" || !x.trim())) {
      throw new Error(`${label}的 race 必須是非空字串陣列。`);
    }
    if (!VALID_CLASSES.includes(m.class)) throw new Error(`${label}的 class 不正確。`);
    if (!VALID_HIT_TYPES.includes(m.hitType)) throw new Error(`${label}的 hitType 不正確。`);
    if (!Number.isInteger(m.rarity) || m.rarity < 1) throw new Error(`${label}的 rarity 必須是正整數。`);
    if (!Number.isInteger(m.releaseYear) || m.releaseYear < 1900 || m.releaseYear > 2200) {
      throw new Error(`${label}的 releaseYear 必須是年份整數。`);
    }
    if (!VALID_OBTAIN_METHODS.includes(m.obtainMethod)) throw new Error(`${label}的 obtainMethod 不正確。`);
    if (typeof m.active !== "boolean") throw new Error(`${label}的 active 必須是布林值。`);
    if (m.aliases !== undefined && !Array.isArray(m.aliases)) throw new Error(`${label}的 aliases 必須是陣列。`);
  });
}
