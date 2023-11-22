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
function extractCorrectAnswer({ answerTrackerMatrix, gameSettings }){
  const correctAnswerArray = answerTrackerMatrix.find(answer => answer.length === 3);
  gameSettings.correctAnswer = correctAnswerArray[0];
}
function getAnswerContainer(e){
  const selectedElement = e.target.localName;
  let answerContainerClassName;
  if (selectedElement === 'div'){
    answerContainerClassName = e.target.className;
  }
  else {
    answerContainerClassName = e.target.parentElement.className;
  }
  const answerContainerHTMLCollection = document.getElementsByClassName(answerContainerClassName);
  const answerContainer = answerContainerHTMLCollection[0];
  return answerContainer;
}
function rightAnswer({ selectedAnswerContainer }){
  setTimeout(() => {
    selectedAnswerContainer.id = 'correct';
  }, 100);
  setTimeout(() => {
    selectedAnswerContainer.id = 'selected';
  }, 200);
  setTimeout(() => {
    selectedAnswerContainer.id = 'correct';
  }, 300);
  setTimeout(() => {
    selectedAnswerContainer.id = 'selected';
  }, 400);
  setTimeout(() => {
    selectedAnswerContainer.id = 'correct';
  }, 500);
  setTimeout(() => {
    selectedAnswerContainer.id = 'selected';
  }, 600);
  setTimeout(() => {
    selectedAnswerContainer.id = 'correct';
  }, 700);
  setTimeout(() => {
    selectedAnswerContainer.id = 'selected';
  }, 800);
  setTimeout(() => {
    selectedAnswerContainer.id = 'correct';
  }, 900);
}
function wrongAnswer({ answerContainer }){
  setTimeout(() => {
    answerContainer.id = 'correct';
  }, 100);
  setTimeout(() => {
    answerContainer.removeAttribute('id');
  }, 200);
  setTimeout(() => {
    answerContainer.id = 'correct';
  }, 300);
  setTimeout(() => {
    answerContainer.removeAttribute('id');
  }, 400);
  setTimeout(() => {
    answerContainer.id = 'correct';
  }, 500);
  setTimeout(() => {
    answerContainer.removeAttribute('id');
  }, 600);
  setTimeout(() => {
    answerContainer.id = 'correct';
  }, 700);
  setTimeout(() => {
    answerContainer.removeAttribute('id');
  }, 800);
  setTimeout(() => {
    answerContainer.id = 'correct';
  }, 900);
}
function nextRound({ selectedAnswerContainer, answerContainersArray, gameSettings }){
  const previousRound = document.getElementById('currentRound');
  previousRound.removeAttribute('id');
  selectedAnswerContainer.removeAttribute('id');
  answerContainersArray.forEach(answerContainer => {
    answerContainer.classList.add('hover');
    answerContainer.onclick = (e) => {selectGuess({ e, gameSettings });};
  });
  gameSettings.round++;
  if (gameSettings.round === 6){
    gameSettings.level = 'medium';
  }
  if (gameSettings.round === 11){
    gameSettings.level = 'hard';
  }
  const nextCategory = provideCategory(gameSettings);
  gameSettings.previousCategory = gameSettings.category;
  gameSettings.category = nextCategory;
  postQuestion(gameSettings);
}
function isCorrect({ selectedAnswerContainer, answerContainersArray, gameSettings }) {
  if (selectedAnswerContainer.classList.contains(gameSettings.correctAnswer)){
    const correctRhombus = document.getElementById('currentRhombus');
    correctRhombus.classList.add('completed');
    let x = 0;
    const rightAnswer = setInterval(() => {
      selectedAnswerContainer.id = 'correct';
      if (++x === 9){
        clearInterval(selectedAnswer);
        clearInterval(rightAnswer);
      }
    },125);
    const selectedAnswer = setInterval(()=>{selectedAnswerContainer.id = 'selected';},250);
    setTimeout(() => {
      nextRound({ selectedAnswerContainer, answerContainersArray, gameSettings });
    }, 3000);
  }
  else {
    answerContainersArray.forEach(answerContainer =>{
      if (answerContainer.classList.contains(gameSettings.correctAnswer)) {
        setInterval(()=>{answerContainer.id = 'correct';},125);
        let x = 0;
        const wrongAnswer = setInterval(() => {
          answerContainer.removeAttribute('id');
          ++x === 5 && clearInterval(wrongAnswer);
        },250);
      }});
    setTimeout(() => {
      location.reload();
    }, 3000);
  }
}
function selectGuess({ e, gameSettings }){
  const selectedAnswerContainer = getAnswerContainer(e);
  const answerContainers = document.getElementsByClassName('answerContainer');
  const answerContainersArray = [...answerContainers];
  if (selectedAnswerContainer.id === 'selected'){
    answerContainersArray.forEach(answerContainer => {
      answerContainer.onclick = (e) => {
        e.preventDefault();
      };
      answerContainer.classList.remove('hover');
    });
    isCorrect({ selectedAnswerContainer, answerContainersArray, gameSettings });
  }
  else{
    answerContainersArray.forEach(answerContainer => {
      answerContainer.id === 'selected' && answerContainer.removeAttribute('id');
    });
    selectedAnswerContainer.id = 'selected';
  }
}

function populatePage({ root, gameSettings }){
  const container = document.createElement('div');
  container.id = 'container';
  root.appendChild(container);
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
    const roundNumber = document.createElement('span');
    roundNumber.className = 'roundNumber';
    roundNumber.innerText = i;
    round.appendChild(roundNumber);
    const rhombus = document.createElement('span');
    rhombus.className = 'rhombus';
    rhombus.innerText = '♦︎';
    round.appendChild(rhombus);
    const prize = document.createElement('span');
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
    answerContainer.classList.add('hover');
    answerContainer.classList.add(i);
    answerBox.appendChild(answerContainer);
    const rhombus = document.createElement('span');
    rhombus.className = 'rhombus';
    rhombus.innerText = '♦︎';
    answerContainer.appendChild(rhombus);
    const letter = document.createElement('span');
    letter.className = 'letter';
    letter.innerText = letterBank[i-1];
    answerContainer.appendChild(letter);
    const answer = document.createElement('span');
    answer.id = `answer${i}`;
    answerContainer.appendChild(answer);
    answerContainer.onclick = (e) => {selectGuess({ e, gameSettings });};
  }
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
    answerContainer.removeAttribute('class');
    answerContainer.innerText = answers[i];
    answers[i].length > 30 && answerContainer.classList.add('long');
    answers[i].length > 50 && answerContainer.classList.add('verylong');
    answers[i].length > 100 && answerContainer.classList.add('jonasehapasado');
    answerPositionTracker[i][0] = answerSlot[0];
  }
  return answerPositionTracker;
}

function provideCategory({ category = undefined, previousCategory = undefined }) {
  const availableCategories = ['html','css','javascript'];
  if (category && previousCategory){
    category === previousCategory && availableCategories.splice(availableCategories.indexOf(category),1);
  }
  const randomIndex = generateRandomNumber(0, availableCategories.length);
  return availableCategories[randomIndex];
}

async function postQuestion(gameSettings){
  const questionData = await getData(gameSettings);
  if (gameSettings.previousQuestions.includes(questionData.question)){
    console.log('We\'ve had this question before!');
    postQuestion(gameSettings);
  }
  else{
    gameSettings.previousQuestions.push(questionData.question);
    const questionContainer = document.getElementById('question');
    questionContainer.removeAttribute('class');
    questionContainer.innerText = questionData.question;
    questionData.question.length > 160 && questionContainer.classList.add('long');
    const answerTrackerMatrix = await answerRandomizer(questionData);
    extractCorrectAnswer({ answerTrackerMatrix, gameSettings });
    const currentRoundHTMLCollection = document.getElementsByClassName(`round ${gameSettings.round}`);
    const currentRound = currentRoundHTMLCollection[0];
    console.log(currentRound);
    const currentRhombus = currentRound.children[1];
    currentRound.id = 'currentRound';
    currentRhombus.id = 'currentRhombus';
    console.log('Posted question gameSettings', gameSettings);
  }
}
function defaultSettings(provideCategory){
  const gameSettings = {
    level: 'easy',
    category: provideCategory({}),
    round: 1,
    previousQuestions: [],
  };
  return gameSettings;
}

async function initPage(){
  const gameSettings = defaultSettings(provideCategory);
  console.log('original GameSettings', gameSettings);
  const root = document.getElementById('root');
  populatePage({ root, gameSettings });
  postQuestion(gameSettings);
}

initPage();
