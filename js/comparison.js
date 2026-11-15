const VALID_HIT_TYPES = ["反射", "反射聚能", "貫通", "貫通聚能"];
const VALID_OBTAIN_METHODS = ["限定角色", "普通角色", "掉落角色"];

function cell(status) {
  return { status };
}

export function compareMonsters(answer, guess) {
  const result = {};

  result.attribute = cell(guess.attribute === answer.attribute ? "exact" : "wrong");

  const answerRaces = new Set(answer.race || []);
  const guessRaces = new Set(guess.race || []);
  const overlap = [...guessRaces].filter((race) => answerRaces.has(race)).length;
  if (answerRaces.size === guessRaces.size && overlap === answerRaces.size) {
    result.race = cell("exact");
  } else if (overlap > 0) {
    result.race = cell("partial");
  } else {
    result.race = cell("wrong");
  }

  result.class = cell(guess.class === answer.class ? "exact" : "wrong");

  const hitBase = (value) => value.startsWith("反射") ? "反射" : "貫通";
  result.hitType = cell(
    guess.hitType === answer.hitType ? "exact" :
    hitBase(guess.hitType) === hitBase(answer.hitType) ? "partial" : "wrong"
  );

  result.rarity = cell(guess.rarity === answer.rarity ? "exact" : "wrong");
  if (guess.releaseYear === answer.releaseYear) {
    result.releaseYear = { status: "exact", direction: "" };
  } else {
    result.releaseYear = {
      status: "direction",
      direction: guess.releaseYear < answer.releaseYear ? "up" : "down"
    };
  }

  result.obtainMethod = cell(guess.obtainMethod === answer.obtainMethod ? "exact" : "wrong");
  return result;
}

export { VALID_HIT_TYPES, VALID_OBTAIN_METHODS };
