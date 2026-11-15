import { compareMonsters } from "./comparison.js";

export class Game {
  constructor({ answer, maxAttempts = 8 }) {
    this.answer = answer;
    this.maxAttempts = maxAttempts;
    this.attempts = [];
    this.finished = false;
    this.won = false;
  }

  submit(guess) {
    if (this.finished) return { accepted: false, reason: "這局遊戲已經結束。" };
    if (this.attempts.some(item => item.id === guess.id)) {
      return { accepted: false, reason: "這個角色已經猜過了，請選擇其他角色。" };
    }

    const comparison = compareMonsters(this.answer, guess);
    this.attempts.push({ id: guess.id, monster: guess, comparison });
    this.won = guess.id === this.answer.id;

    if (this.won || this.attempts.length >= this.maxAttempts) {
      this.finished = true;
    }
    return {
      accepted: true,
      comparison,
      won: this.won,
      finished: this.finished,
      remaining: this.maxAttempts - this.attempts.length
    };
  }
}
