import { loadGameData } from "./data.js";
import { Game } from "./game.js";
import { getDailyAnswer, getDailyDate } from "./daily.js";
import { getRandomAnswer } from "./unlimited.js";
import { renderGuess, showMessage, finishGame } from "./ui.js";

const $ = selector => document.querySelector(selector);
let monsters = [];
let config;
let dailyConfig;
let mode = "daily";
let game;
let previousUnlimitedId = null;

const input = $("#character-input");
const datalist = $("#character-options");
input.addEventListener("input", () => {
  const keyword = input.value.trim();

  datalist.innerHTML = "";

  if (!keyword) return;

  const matchedMonsters = monsters.filter(monster => {
    return monster.name.includes(keyword) ||
      (monster.aliases || []).some(alias => alias.includes(keyword));
  });

  for (const monster of matchedMonsters) {
    const option = document.createElement("option");
    option.value = monster.name;
    datalist.append(option);
  }
});
const form = $("#guess-form");
const results = $("#results");
const message = $("#message");
const count = $("#attempt-count");
const guessButton = $("#guess-button");
const endPanel = $("#end-panel");

function getStorageKey() {
  return `ms-wordle:${mode}:${mode === "daily" ? getDailyDate() : "current"}`;
}

function startGame({ preserveDaily = false } = {}) {
  const answer = mode === "daily"
    ? getDailyAnswer(monsters, dailyConfig)
    : getRandomAnswer(monsters, previousUnlimitedId);

  if (mode === "unlimited") previousUnlimitedId = answer.id;
  game = new Game({ answer, maxAttempts: config.maxAttempts });

  results.replaceChildren();
  count.textContent = "0";
  input.value = "";
  endPanel.classList.add("hidden");
  guessButton.disabled = false;

  const date = getDailyDate();
  $("#date-label").textContent = mode === "daily" ? date : "自由練習";
  $("#mode-eyebrow").textContent = mode === "daily" ? "DAILY CHALLENGE" : "UNLIMITED MODE";
  $("#mode-title").textContent = mode === "daily" ? "今日挑戰" : "無限模式";
  $("#mode-description").textContent = `最多猜測 ${config.maxAttempts} 次。`;
  showMessage(message, mode === "daily" ? "今天的題目已準備好，開始猜測吧！" : "新的一局開始了！");
  if (mode === "daily" && !preserveDaily) restoreDailyGame();
}

function saveDailyGame() {
  if (mode !== "daily") return;
  const payload = {
    date: getDailyDate(),
    attempts: game.attempts.map(a => a.id),
    finished: game.finished,
    won: game.won
  };
  localStorage.setItem(getStorageKey(), JSON.stringify(payload));
}

function restoreDailyGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(getStorageKey()) || "null");
    if (!saved || saved.date !== getDailyDate()) return;
    for (const id of saved.attempts || []) {
      const monster = monsters.find(m => m.id === id);
      if (!monster || game.finished) continue;
      const result = game.submit(monster);
      if (result.accepted) renderGuess(results, monster, result.comparison);
    }
    count.textContent = String(game.attempts.length);
    if (game.finished) {
      guessButton.disabled = true;
      finishGame({
        panel: endPanel, title: $("#end-title"), description: $("#end-description"),
        won: game.won, answer: game.answer, attempts: game.attempts.length
      });
      showMessage(message, "已恢復今天的挑戰紀錄。");
    } else if (game.attempts.length) {
      showMessage(message, "已恢復今天的挑戰紀錄，可以繼續猜測。");
    }
  } catch {
    localStorage.removeItem(getStorageKey());
  }
}

function setMode(nextMode) {
  mode = nextMode;
  document.querySelectorAll(".mode-tab").forEach(button =>
    button.classList.toggle("active", button.dataset.mode === mode)
  );
  startGame();
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const value = input.value.trim();
  const guess = monsters.find(m => m.name === value || (m.aliases || []).includes(value));
  if (!guess) {
    showMessage(message, "找不到這個角色，請從清單選擇有效角色。", true);
    return;
  }

  const result = game.submit(guess);
  if (!result.accepted) {
    showMessage(message, result.reason, true);
    return;
  }

  renderGuess(results, guess, result.comparison);
  count.textContent = String(game.attempts.length);
  input.value = "";

  if (result.finished) {
    guessButton.disabled = true;
    finishGame({
      panel: endPanel, title: $("#end-title"), description: $("#end-description"),
      won: result.won, answer: game.answer, attempts: game.attempts.length
    });
    showMessage(message, result.won ? "挑戰成功！" : "已達到猜測次數上限。");
  } else {
    showMessage(message, `猜測完成，還有 ${result.remaining} 次機會。`);
  }
  saveDailyGame();
});

document.querySelectorAll(".mode-tab").forEach(button =>
  button.addEventListener("click", () => setMode(button.dataset.mode))
);

$("#restart-button").addEventListener("click", () => {
  if (mode === "daily") {
    showMessage(message, "每日挑戰每天只有一題，明天再來挑戰！");
    return;
  }
  startGame();
});

async function init() {
  try {
    const data = await loadGameData();
    monsters = data.monsters.filter(monster => monster.active);
    config = data.config;
    dailyConfig = data.dailyConfig;

    if (!monsters.length) throw new Error("目前沒有 active 設為 true 的角色。");

    if (monsters.every(m => m.isDemo)) {
      showMessage(message, "目前載入的是示範角色，請替換成確認過的台版角色資料。");
    }

    startGame();
  } catch (error) {
    showMessage(message, error.message, true);
    guessButton.disabled = true;
  }
}
init();
