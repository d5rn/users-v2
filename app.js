const jsonKey = "usersV2";
const formEl = document.querySelector("#register");
const nameEl = document.querySelector("#name");
const msgEl = document.querySelector("#msg");
const usersEl = document.querySelector("#users");
const cntEl = document.querySelector("#count");
const clearEl = document.querySelector("#clear");
const searchEl = document.querySelector("#search");
const noResultEl = document.querySelector("#noResult");
const sortEl = document.querySelector("#sort");

let usersArr = [
  { name: "たろう", date: "2026-11-01" },
  { name: "はなこ", date: "2026-11-03" }
];

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameEl.value.trim();
  if (name === ""){
    msgEl.textContent = "名前を入力してください";
    return;
  }
  if(usersArr.some((data) => data.name === name)){
    msgEl.textContent = "その名前は既に登録されています";
    return;
  }
  const data = { name, date: todayStr() };
  usersArr.push(data);
  makeLi(data);
  msgEl.textContent = `${name}さんを登録しました`;
  nameEl.value = "";
  saveUsers();
});

usersEl.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") editLi(event.target);
  if (event.target.tagName !== "LI") return;
  const liName = event.target.dataset.name;
  if (!confirm(`user：${liName}を削除しますか？`)) return;
  const pos = usersArr.findIndex((data) => data.name === liName);
  if(pos === -1) return;
  usersArr.splice(pos, 1);
  event.target.remove();
  updateCntEl();
  saveUsers();
});

clearEl.addEventListener("click", () => {
  if(!confirm("すべて削除しますか？")) return;
  clearLi();
});

searchEl.addEventListener("input", () => {
  const keyword = searchEl.value;
  const kwArr = usersArr.filter((data) => data.name.includes(keyword));
  usersEl.replaceChildren();
  kwArr.forEach((data) => {makeLi(data)});
  if(kwArr.length === 0 && keyword.length > 0){
    noResultEl.textContent = "該当する登録者はいません";
  }else {
    noResultEl.textContent = "";
  }
});

sortEl.addEventListener("click", sortLi);

loadUsers();

function todayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function makeLi(data) {
  const li =  document.createElement("li");
  const edit = document.createElement("button");
  li.textContent = `${data.name}（${data.date}）`;
  edit.textContent = "編集";
  li.dataset.name = data.name;
  edit.dataset.name = data.name;
  li.appendChild(edit);
  usersEl.appendChild(li);
  updateCntEl();
}

function clearLi() {
  usersArr = [];
  usersEl.replaceChildren();
  updateCntEl();
  saveUsers();
}

function sortLi() {
  usersArr.sort((a, b) => a.name.localeCompare(b.name, "ja"));
  usersEl.replaceChildren();
  usersArr.forEach((data) => { makeLi(data) });
  saveUsers();
}

function editLi(button){
  const nowName = button.dataset.name;
  const newName = prompt("変更する名前を入力してください", nowName);
  if(newName === null || newName === "") return;
  if (usersArr.some((data) => data.name === newName && data.name !== nowName)) return;
  const pos  = usersArr.findIndex((data) => data.name === nowName);
  if(pos === -1) return;
  usersArr[pos].name = newName;
  usersEl.replaceChildren();
  usersArr.forEach((data) => makeLi(data));
  saveUsers();
}

function saveUsers() {
  localStorage.setItem(jsonKey, JSON.stringify(usersArr));
}

function loadUsers() {
  const data = JSON.parse(localStorage.getItem(jsonKey));
  if(data !== null) usersArr = data;
  usersArr.forEach((data) => makeLi(data));
}

function updateCntEl() {
  cntEl.textContent = `登録者：${usersArr.length}人`;
}
