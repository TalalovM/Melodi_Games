let teams = [];
let categories = [];
let currentSong;
let currentPoints;
let timer;

// FULLSCREEN

function toggleFullscreen(){

  if(!document.fullscreenElement){
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// SETTINGS

function openSettings(){
  document.getElementById("settingsModal").style.display="block";

  renderTeamsList();
  renderCats();
}

function closeSettings(){
  document.getElementById("settingsModal").style.display="none";
}

function openTab(id){

  document.querySelectorAll(".tab")
    .forEach(tab=>{
      tab.classList.remove("active");
    });

  document.getElementById(id)
    .classList.add("active");
}

// TEAMS

function addTeam(){

  const input =
    document.getElementById("teamName");

  const name = input.value.trim();

  if(!name) return;

  teams.push({
    name,
    score:0
  });

  input.value="";

  renderTeams();
  renderTeamsList();
}

function renderTeams(){

  const div =
    document.getElementById("teams");

  div.innerHTML="";

  teams.forEach(team=>{

    div.innerHTML += `
      <div class="team">
        ${team.name}: ${team.score}
      </div>
    `;
  });
}

function renderTeamsList(){

  const div =
    document.getElementById("teamsList");

  div.innerHTML="";

  teams.forEach((team,index)=>{

    div.innerHTML += `
      <div class="card">

        ${team.name}

        <button onclick="removeTeam(${index})">
          ❌
        </button>

      </div>
    `;
  });
}

function removeTeam(index){

  teams.splice(index,1);

  renderTeams();
  renderTeamsList();
}

// CATEGORIES

function addCategory(){

  const input =
    document.getElementById("catName");

  const name = input.value.trim();

  if(!name) return;

  categories.push({
    name,
    songs:[]
  });

  input.value="";

  renderCats();
  renderBoard();
}

function renderCats(){

  const div =
    document.getElementById("catsList");

  const select =
    document.getElementById("catSelect");

  div.innerHTML="";
  select.innerHTML="";

  categories.forEach((cat,index)=>{

    div.innerHTML += `
      <div class="card">

        ${cat.name}

        <button onclick="removeCat(${index})">
          ❌
        </button>

      </div>
    `;

    select.innerHTML += `
      <option value="${cat.name}">
        ${cat.name}
      </option>
    `;
  });
}

function removeCat(index){

  categories.splice(index,1);

  renderCats();
  renderBoard();
}

// SONGS

function fileToBase64(file){

  return new Promise(resolve=>{

    const reader = new FileReader();

    reader.onload = ()=>{
      resolve(reader.result);
    };

    reader.readAsDataURL(file);
  });
}

async function addSong(){

  const catName =
    document.getElementById("catSelect").value;

  const points =
    +document.getElementById("points").value;

  const minusFile =
    document.getElementById("minusFile").files[0];

  const plusFile =
    document.getElementById("plusFile").files[0];

  if(!minusFile || !plusFile) return;

  const minus =
    await fileToBase64(minusFile);

  const plus =
    await fileToBase64(plusFile);

  const cat =
    categories.find(c=>c.name===catName);

  cat.songs.push({
    points,
    minus,
    plus
  });

  renderBoard();
}

// BOARD

function renderBoard(){

  const board =
    document.getElementById("board");

  board.innerHTML="";

  categories.forEach(cat=>{

    const column =
      document.createElement("div");

    column.className="category";

    column.innerHTML = `
      <h3>${cat.name}</h3>
    `;

    cat.songs.forEach(song=>{

      const cell =
        document.createElement("div");

      cell.className="cell";

      cell.innerText=song.points;

      cell.onclick=()=>{
        openSong(song,cell);
      };

      column.appendChild(cell);
    });

    board.appendChild(column);
  });
}

// GAME

function openSong(song,cell){

  currentSong=song;
  currentPoints=song.points;

  document.getElementById("playerModal")
    .style.display="block";

  const audio =
    document.getElementById("audio");

  audio.src=song.minus;

  audio.play();

  document.getElementById("roundPoints")
    .innerText=`${song.points} очков`;

  cell.classList.add("used");

  renderTeamButtons();

  startTimer();
}

function playPlus(){

  const audio =
    document.getElementById("audio");

  audio.src=currentSong.plus;

  audio.play();
}

function renderTeamButtons(){

  const div =
    document.getElementById("teamButtons");

  div.innerHTML="";

  teams.forEach((team,index)=>{

    const button =
      document.createElement("button");

    button.innerText=team.name;

    button.onclick=()=>{

      teams[index].score += currentPoints;

      renderTeams();

      closePlayer();
    };

    div.appendChild(button);
  });
}

function closePlayer(){

  document.getElementById("playerModal")
    .style.display="none";

  clearInterval(timer);
}

// TIMER

function startTimer(){

  let time=15;

  const timerEl =
    document.getElementById("timer");

  timerEl.innerText=time;

  clearInterval(timer);

  timer=setInterval(()=>{

    time--;

    timerEl.innerText=time;

    if(time<=0){
      clearInterval(timer);
    }

  },1000);
}
// ЗАГРУЗКА ФОНА ПРИ СТАРТЕ
window.onload = () => {
  const savedBg = localStorage.getItem("bg");
  if (savedBg) {
    document.body.style.backgroundImage = `url(${savedBg})`;
    document.body.style.backgroundSize = "cover";
  }
};

// СОХРАНЕНИЕ ФОНА
function saveSettings() {
  const file = document.getElementById("bgInput").files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function () {
    const bg = reader.result;

    // применяем фон
    document.body.style.backgroundImage = `url(${bg})`;
    document.body.style.backgroundSize = "cover";

    // сохраняем в память браузера
    localStorage.setItem("bg", bg);
  };

  reader.readAsDataURL(file);
}

// LOAD

renderTeams();
renderBoard();