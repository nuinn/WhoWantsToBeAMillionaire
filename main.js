function generateRandomNumber(min, max) {
  const randomNumber = Math.floor(Math.random() * (max - min) + min);
  return randomNumber;
}
async function getData({ level, category }){
  const url = `https://quiz-api-ofkh.onrender.com/questions/random?level=${level}&category=${category}`;
  const response = await fetch(url);
  const data = await response.json();
  const questionObject = {};
  questionObject.question = data.description;
  questionObject.answers = data.answers;
  questionObject.correct = data.correctAnswer;
  return questionObject;
}
const gameSettings = {
  level: 'easy',
  category: 'css'
};

// getData(gameSettings);

function populatePage(container){
  const top = document.createElement('div');
  const bottom = document.createElement('div');
  top.id = 'top';
  bottom.id = 'bottom';
  container.appendChild(top);
  container.appendChild(bottom);
  const logoContainer = document.createElement('div');
  const gameConsole = document.createElement('div');
  logoContainer.id = 'logoContainer';
  gameConsole.id = 'gameConsole';
  top.appendChild(logoContainer);
  top.appendChild(gameConsole);
  const logo = document.createElement('img');
  logo.id = 'logo';
  logo.src = './img/logo.png';
  logoContainer.appendChild(logo);
  const lifelinesContainer = document.createElement('div');
  lifelinesContainer.id = 'lifelinesContainer';
  gameConsole.appendChild(lifelinesContainer);
  const roundsContainer = document.createElement('div');
  roundsContainer.id = 'roundsContainer';
  gameConsole.appendChild(roundsContainer);
  const prizeBank = ['100 €','200 €','300 €','500 €','1.000 €','2.000 €','4.000 €','8.000 €','16.000 €','32.000 €','64.000 €','125.000 €','250.000 €','500.000 €','1.000.000 €'];
  for (let i = 15; i > 0; i--) {
    const round = document.createElement('div');
    round.className = 'round';
    round.classList.add(i);
    i % 5 === 0 && round.classList.add('milestone');
    roundsContainer.appendChild(round);
    const roundNumber = document.createElement('div');
    roundNumber.className = 'roundNumber';
    roundNumber.innerText = i;
    round.appendChild(roundNumber);
    const prize = document.createElement('div');
    prize.className = 'prize';
    prize.innerText = prizeBank[i-1];
    round.appendChild(prize);
  }
  const questionContainer = document.createElement('div');
  questionContainer.id = 'questionContainer';
  bottom.appendChild(questionContainer);
  const questionBorder = document.createElement('div');
  questionBorder.id = 'questionBorder';
  questionContainer.appendChild(questionBorder);
  const question = document.createElement('div');
  question.id = 'question';
  questionContainer.appendChild(question);
  const answersContainer = document.createElement('div');
  answersContainer.id = 'answersContainer';
  bottom.appendChild(answersContainer);
  const letterBank = ['A:','B:','C:','D:'];
  for (let i = 1; i < 5; i++) {
    const answerBox = document.createElement('div');
    answerBox.className = 'answerBox';
    answersContainer.appendChild(answerBox);
    const answerBorder = document.createElement('div');
    answerBorder.className = 'answerBorder';
    answerBox.appendChild(answerBorder);
    const answerContainer = document.createElement('div');
    answerContainer.className = 'answerContainer';
    answerContainer.classList.add(i);
    answerBox.appendChild(answerContainer);
    const letter = document.createElement('span');
    letter.className = 'letter';
    letter.innerText = letterBank[i-1];
    answerContainer.appendChild(letter);
    const answer = document.createElement('span');
    answer.id = `answer${i}`;
    answerContainer.appendChild(answer);
  }
  // return bottom;
}

async function answerRandomizer(questionData){
  const answersData = await questionData.answers;
  const correctAnswer = await questionData.correct;
  const answers = Object.values(answersData);
  const answerPositionTracker = Object.entries(answersData);
  answerPositionTracker.map((answer) => answer[0] === correctAnswer && answer.push('correct'));
  const answerSlots = [1,2,3,4];
  const loopIterations = answerSlots.length;
  for (let i = 0; i < loopIterations; i++) {
    const randomNumber = generateRandomNumber(0,answerSlots.length);
    const answerSlot = answerSlots.splice(randomNumber,1);
    const answerContainer = document.getElementById(`answer${answerSlot[0]}`);
    answerContainer.innerText = answers[i];
    answerPositionTracker[i][0] = answerSlot[0];
  }
  return answerPositionTracker;
}



async function initPage(){
  const root = document.getElementById('root');
  const container = document.createElement('div');
  container.id = 'container';
  root.appendChild(container);
  populatePage(container);
  const questionData = await getData(gameSettings);
  const questionContainer = document.getElementById('question');
  questionContainer.innerText = questionData.question;
  answerRandomizer(questionData);
  const answerContainer = document.getElementsByClassName('answerContainer');
  console.log(answerContainer);
  answerContainer.onclick = (e) => {
    console.log(e);
  };
}

initPage();