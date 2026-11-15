export function getRandomAnswer(monsters, previousId = null) {
  if (!monsters.length) throw new Error("目前沒有可供遊玩的角色。");
  const candidates = monsters.length > 1
    ? monsters.filter(m => m.id !== previousId)
    : monsters;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
