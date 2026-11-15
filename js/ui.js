function cell(text, status) {
  const td = document.createElement("td");
  td.className = status;
  td.textContent = text;
  return td;
}

export function renderGuess(tbody, monster, comparison) {
  const tr = document.createElement("tr");
  const name = document.createElement("td");
  name.className = "name-cell";
  name.textContent = monster.name;
  tr.append(name);

  tr.append(cell(monster.attribute, comparison.attribute.status));
  tr.append(cell(monster.race.join("／"), comparison.race.status));
  tr.append(cell(monster.class, comparison.class.status));
  tr.append(cell(monster.hitType, comparison.hitType.status));
  tr.append(cell(`★${monster.rarity}`, comparison.rarity.status));

  let yearText = String(monster.releaseYear);
  if (comparison.releaseYear.status === "direction") {
    yearText += comparison.releaseYear.direction === "up" ? " ↑" : " ↓";
  }
  tr.append(cell(yearText, comparison.releaseYear.status));
  tr.append(cell(monster.obtainMethod, comparison.obtainMethod.status));
  tbody.prepend(tr);
}

export function showMessage(element, text, isError = false) {
  element.textContent = text;
  element.classList.toggle("error", isError);
}

export function finishGame({ panel, title, description, won, answer, attempts }) {
  panel.classList.remove("hidden");
  title.textContent = won ? "恭喜猜中了！" : "本局結束";
  description.textContent = won
    ? `你使用 ${attempts} 次猜中答案。`
    : `正確答案是：${answer.name}`;
}
