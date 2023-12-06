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
function getAnswerContainersMatrix(){
  const answerContainers = document.getElementsByClassName('answerContainer');
  const answerContainersMatrix = [...answerContainers];
  return answerContainersMatrix;
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
function unblockGame({ answerContainersArray, gameSettings, audioLibrary }) {
  const logoContainer = document.getElementById('logoContainer');
  logoContainer.classList.remove('announce');
  logoContainer.classList.add('hover');
  answerContainersArray.forEach(answerContainer => {
    answerContainer.classList.add('hover');
    answerContainer.classList.remove('disappear');
    answerContainer.onclick = (e) => {selectGuess({ e, gameSettings, audioLibrary });};
  });
  const fiftyFifty = document.getElementById('50');
  if (!fiftyFifty.classList.contains('used')) {
    fiftyFifty.classList.add('hover');
    fiftyFifty.onclick = () => {
      halveAnswers({ fiftyFifty, gameSettings, audioLibrary });
    };
  }
  const phoneFriend = document.getElementById('phone');
  if (!phoneFriend.classList.contains('used')) {
    phoneFriend.classList.add('hover');
    phoneFriend.onclick = () => {
      phoneMum({ phoneFriend, gameSettings, audioLibrary });
   };
  }
  const flip = document.getElementById('flip');
  if (!flip.classList.contains('used')) {
    flip.classList.add('hover');
    flip.onclick = () => {
      flipQuestion({ flip, gameSettings, audioLibrary });};
  }
}

function nextRound({ selectedAnswerContainer, answerContainersArray, previousRound, gameSettings, audioLibrary }){
  const messageContainer = document.getElementById('messageContainer');
  const prizeAnnouncer = document.getElementById('prizeAnnouncer');
  prizeAnnouncer.innerText = '¿te rindes?';
  const startFinish = document.getElementById('startFinish');
  startFinish.onclick = () => { walk({ gameSettings, answerContainersArray, audioLibrary }); };
  messageContainer.removeAttribute('class');
  messageContainer.innerText = '';
  previousRound.removeAttribute('id');
  selectedAnswerContainer.removeAttribute('id');
  gameSettings.round++;
  unblockGame({ answerContainersArray, gameSettings, audioLibrary });
  if (gameSettings.round === 6){
    gameSettings.level = 'medium';
  }
  if (gameSettings.round === 11){
    gameSettings.level = 'hard';
  }
  const nextCategory = provideCategory(gameSettings);
  gameSettings.previousCategory = gameSettings.category;
  gameSettings.category = nextCategory;
  postQuestion({ gameSettings, audioLibrary });
}

function postPrize({ gameSettings, audioLibrary }) {
  const prizeAnnouncer = document.getElementById('prizeAnnouncer')
  const previousRound = document.getElementById('currentRound');
  gameSettings.currentPrize = previousRound.lastChild.innerText;
  if (gameSettings.currentPrize === '1.000.000 €'){
    audioHandler({ sound: 'win', audioLibrary });
    prizeAnnouncer.innerText = '¡Vaya! ¡Eres millonario!';
    const logoContainer = document.getElementById('logoContainer');
    logoContainer.classList.add('endGame');
    return;
  }
  else if (previousRound.classList.contains('milestone')){
    gameSettings.guaranteedPrize = gameSettings.currentPrize;
    prizeAnnouncer.innerText = `${gameSettings.currentPrize} garantizados!`;
  }
  else{
    prizeAnnouncer.innerText = gameSettings.currentPrize;
  }
  const logoContainer = document.getElementById('logoContainer');
  logoContainer.classList.add('announce');
  return previousRound;
}

function fail({ gameSettings }){
  const prizeAnnouncer = document.getElementById('prizeAnnouncer')
  if (!gameSettings.guaranteedPrize){
    prizeAnnouncer.innerText = 'Lo siento, ¡te vas a casa sin nada!'
  }
  else {
    prizeAnnouncer.innerText = `Bueno, te vas a casa con ${gameSettings.guaranteedPrize}.`;
  }
  const logoContainer = document.getElementById('logoContainer');
  logoContainer.classList.add('endGame');
}

function walk({ gameSettings, answerContainersArray, audioLibrary }) {
  audioHandler({ sound: 'off', audioLibrary });
  audioHandler({ sound: 'walk', audioLibrary });
  blockGame({ answerContainersArray });
  const prizeAnnouncer = document.getElementById('prizeAnnouncer');
  prizeAnnouncer.innerText = `Te llevas ${gameSettings.currentPrize} a casa.`;
  const logoContainer = document.getElementById('logoContainer');
  logoContainer.classList.add('endGame');
}

function getAudio() {
  // phone chime
  const library = {};
  library.startGame = new Audio('./audio/startGame.mp3');
  library.easyQuestion = new Audio('./audio/easyQuestion.mp3');
  library.easyQuestion.loop = true;
  library.mediumQuestion = new Audio('./audio/mediumQuestion.mp3');
  library.mediumQuestion.loop = true;
  library.hardQuestion = new Audio('./audio/hardQuestion.mp3');
  library.hardQuestion.loop = true;
  library.correct = new Audio('./audio/correct.mp3');
  library.incorrect = new Audio('./audio/incorrect.mp3');
  library.finalAnswer = new Audio('./audio/finalAnswer.mp3');
  library.fifty = new Audio('./audio/fifty.mp3');
  library.message = new Audio('./audio/message.mp3');
  library.flip = new Audio('./audio/flip.mp3');
  library.win = new Audio('./audio/gameWin.mp3');
  library.walk = new Audio('./audio/walk.mp3');
  return library;
}

function audioHandler({ audioLibrary, sound }) {
  switch (true) {
    case sound === 'startGame':
      audioLibrary.startGame.play();
      break;
    case sound === 'easyQuestion':
      audioLibrary.easyQuestion.play();
      break;
    case sound === 'mediumQuestion':
      audioLibrary.mediumQuestion.play();
      break;  
    case sound === 'hardQuestion':
      audioLibrary.hardQuestion.play();
      break;    
    case sound === 'correct':
      audioLibrary.correct.play();
      break;
    case sound === 'incorrect':
      audioLibrary.incorrect.play();
      break;
    case sound === 'finalAnswer':
      audioLibrary.finalAnswer.play();
      break;
    case sound === 'message':
      audioLibrary.message.play();
      break;
    case sound === 'fifty':
      audioLibrary.fifty.play();
      break;    
    case sound === 'flip':
      audioLibrary.flip.play();
      break;
    case sound === 'win':
      audioLibrary.win.play();
      break;     
    case sound === 'walk':
      audioLibrary.walk.play();
      break;        
    case sound === 'off':
      audioLibrary.easyQuestion.currentTime = 0;
      audioLibrary.easyQuestion.pause();
      audioLibrary.mediumQuestion.currentTime = 0;
      audioLibrary.mediumQuestion.pause();
      audioLibrary.hardQuestion.currentTime = 0;
      audioLibrary.hardQuestion.pause();
      break;
    default:
      break;
  }
};

function isCorrect({ selectedAnswerContainer, answerContainersArray, gameSettings, audioLibrary }) {
  const messageContainer = document.getElementById('messageContainer');
  messageContainer.classList.add('hideMessage');
  if (selectedAnswerContainer.classList.contains(gameSettings.correctAnswer)){
    const previousRound = postPrize({ gameSettings, audioLibrary });
    const correctRhombus = document.getElementById('currentRhombus');
    correctRhombus.classList.add('completed');
    audioHandler({ audioLibrary, sound: 'off' });
    audioHandler({ audioLibrary, sound: 'correct' });
    let x = 0;
    const rightAnswer = setInterval(() => {
      selectedAnswerContainer.id = 'correct';
      if (++x === 9){
        clearInterval(selectedAnswer);
        clearInterval(rightAnswer);
      }
    },125);
    const selectedAnswer = setInterval(()=>{selectedAnswerContainer.id = 'selected';},250);
    if (previousRound) {
    setTimeout(() => {
      nextRound({ selectedAnswerContainer, answerContainersArray, previousRound, gameSettings, audioLibrary });
    }, 3000);}
  }
  else {
    answerContainersArray.forEach(answerContainer =>{
      if (answerContainer.classList.contains(gameSettings.correctAnswer)) {
        audioHandler({ audioLibrary, sound: 'off' });
        audioHandler({ audioLibrary, sound: 'incorrect' });
        fail({ gameSettings });
        setInterval(()=>{answerContainer.id = 'correct';},125);
        let x = 0;
        const wrongAnswer = setInterval(() => {
          answerContainer.removeAttribute('id');
          ++x === 5 && clearInterval(wrongAnswer);
        },250);
      }});
    // setTimeout(() => {
    //   location.reload();
    // }, 3000);
  }
}
function blockGame({ answerContainersArray }) {
  answerContainersArray.forEach(answerContainer => {
    answerContainer.onclick = (e) => {
      e.preventDefault();
    };
    answerContainer.classList.remove('hover');
  });
  const lifelineContainers = document.getElementsByClassName('lifeline');
  const lifelineContainersArray = [...lifelineContainers];
  lifelineContainersArray.forEach(lifelineContainer => {
    lifelineContainer.onclick = (e) => {
      e.preventDefault();
    };
    lifelineContainer.classList.remove('hover');
  });
  const logoContainer = document.getElementById('logoContainer');
  logoContainer.classList.remove('hover');
}

function selectGuess({ e, gameSettings, audioLibrary }){
  gameSettings.level === 'medium' && audioHandler({ sound: 'finalAnswer', audioLibrary });
  const selectedAnswerContainer = getAnswerContainer(e);
  const answerContainers = document.getElementsByClassName('answerContainer');
  const answerContainersArray = [...answerContainers];
  if (selectedAnswerContainer.id === 'selected'){
    blockGame({ answerContainersArray });
    isCorrect({ selectedAnswerContainer, answerContainersArray, gameSettings, audioLibrary });
  }
  else{
    answerContainersArray.forEach(answerContainer => {
      answerContainer.id === 'selected' && answerContainer.removeAttribute('id');
    });
    selectedAnswerContainer.id = 'selected';
  }
}
function flipQuestion({ flip, gameSettings, audioLibrary }){
  // phone a friend doesn't work after this is used
  audioHandler({ sound: 'flip', audioLibrary });
  flip.onclick = (e) => {
    e.preventDefault();
  };
  flip.classList.remove('hover');
  flip.classList.add('used');
  const messageContainer = document.getElementById('messageContainer');
  messageContainer.classList.contains('message') && messageContainer.classList.add('hideMessage');
  const answerContainersMatrix = getAnswerContainersMatrix();
  answerContainersMatrix.forEach(answerContainer => {
    answerContainer.classList.add('hover');
    answerContainer.classList.remove('disappear');
    answerContainer.onclick = (e) => {selectGuess({ e, gameSettings, audioLibrary });};
  });
  const nextCategory = provideCategory(gameSettings);
  gameSettings.previousCategory = gameSettings.category;
  gameSettings.category = nextCategory;
  postQuestion({ gameSettings, audioLibrary });
}
function removeAnswer({ answerNumber }){
  const removedAnswerHTMLCollection = document.getElementsByClassName(`answerContainer hover ${answerNumber}`);
  const removedAnswer = removedAnswerHTMLCollection[0];
  removedAnswer.classList.add('disappear');
  removedAnswer.classList.remove('hover');
  removedAnswer.onclick = (e) => {
    e.preventDefault();
  };
}

function halveAnswers({ fiftyFifty, gameSettings, audioLibrary }){
  audioHandler({ sound: 'fifty', audioLibrary });
  fiftyFifty.onclick = (e) => {
    e.preventDefault();
  };
  fiftyFifty.classList.remove('hover');
  fiftyFifty.classList.add('used');
  const possibleAnswers = [1,2,3,4];
  possibleAnswers.splice(possibleAnswers.indexOf(gameSettings.correctAnswer),1);
  const amountOfAnswersToBeRemoved = 2;
  for (let i = 0; i < amountOfAnswersToBeRemoved; i++) {
    const randomNumber = generateRandomNumber(0,possibleAnswers.length);
    const randomIncorrectAnswer = possibleAnswers.splice(randomNumber,1);
    removeAnswer({ answerNumber: randomIncorrectAnswer });
  }
}

function aGoodGuess({ existingAnswerContainers, gameSettings }) {
  const letterMatrix = { 1: 'A', 2: 'B', 3: 'C', 4: 'D'};
  const existingAnswers = [];
  for (let i = 0; i < existingAnswerContainers.length; i++) {
    const answerContainer = existingAnswerContainers[i];
    switch (true) {
      case answerContainer.classList.contains(1):
        existingAnswers.push('A');
        break;
      case answerContainer.classList.contains(2):
        existingAnswers.push('B');
        break;
      case answerContainer.classList.contains(3):
        existingAnswers.push('C');
        break;
      case answerContainer.classList.contains(4):
        existingAnswers.push('D');
        break;  
      default:
        break;
  }};
  const randomNumber = generateRandomNumber(0, 10);
  if (existingAnswers[randomNumber]) {
    return existingAnswers[randomNumber];
  }
  else {
    return letterMatrix[gameSettings.correctAnswer];
  }
}

function phoneMum({ phoneFriend, gameSettings, audioLibrary }){
  audioHandler({ sound: 'message', audioLibrary });
  phoneFriend.onclick = (e) => {
    e.preventDefault();
  };
  phoneFriend.classList.remove('hover');
  phoneFriend.classList.add('used');
  const answerContainersMatrix = getAnswerContainersMatrix();
  const existingAnswerContainers = answerContainersMatrix.filter((answerContainer) =>
    !answerContainer.classList.contains('disappear'));
  const suggestedAnswer = aGoodGuess({ existingAnswerContainers, gameSettings });  
  const messageContainer = document.getElementById('messageContainer');
  messageContainer.classList.add('message');
  messageContainer.innerHTML = `✉️`+'&nbsp&nbsp&nbsp'+`"Estoy casi segura de que la respuesta correcta es la ${suggestedAnswer}."`;
}

function populatePage({ root, gameSettings, audioLibrary }){
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
  // logoContainer.classList.add('hover');
  gameConsole.id = 'gameConsole';
  top.appendChild(logoContainer);
  top.appendChild(gameConsole);
  const logo = document.createElement('img');
  logo.id = 'logo';
  logo.src = './img/logo.png';
  logoContainer.appendChild(logo);
  const messageContainer = document.createElement('div');
  messageContainer.id = 'messageContainer';
  logoContainer.appendChild(messageContainer);
  const prizeHandler = document.createElement('div');
  prizeHandler.id = 'prizeHandler';
  logoContainer.appendChild(prizeHandler);
  const prizeAnnouncer = document.createElement('span');
  logoContainer.classList.add('startGame');
  prizeAnnouncer.id = 'prizeAnnouncer';
  prizeAnnouncer.innerText = '¿Comenzar Juego?';
  prizeHandler.appendChild(prizeAnnouncer);
  const startFinish = document.createElement('div');
  startFinish.id = 'startFinish';
  startFinish.innerText = 'OK'
  prizeHandler.appendChild(startFinish);
  startFinish.onclick = () => { startGame({ logoContainer, gameSettings, audioLibrary }) };
  const lifelinesContainer = document.createElement('div');
  lifelinesContainer.id = 'lifelinesContainer';
  gameConsole.appendChild(lifelinesContainer);
  const lifelines = ['50','phone','flip'];
  for (let i = 0; i < lifelines.length; i++) {
    const lifeline = lifelines[i];
    const lifelineContainer = document.createElement('div');
    lifelineContainer.className = 'lifeline';
    lifelineContainer.classList.add('hover');
    lifelineContainer.id = lifeline;
    lifelinesContainer.appendChild(lifelineContainer);
  }
  const fiftyFifty = document.getElementById('50');
  fiftyFifty.innerText = '50:50';
  fiftyFifty.onclick = () => {
    halveAnswers({ fiftyFifty, gameSettings, audioLibrary });
  };
  const phoneFriend = document.getElementById('phone');
  const phoneImage = document.createElement('img');
  phoneImage.src = './img/phone.png';
  phoneImage.id = 'phoneImage';
  phoneFriend.appendChild(phoneImage);
  phoneFriend.onclick = () => {
     phoneMum({ phoneFriend, gameSettings, audioLibrary });
  };
  const flip = document.getElementById('flip');
  const flipImage = document.createElement('img');
  flipImage.src = './img/flip.png';
  flipImage.id = 'flipImage';
  flip.appendChild(flipImage);
  flip.onclick = () => {
    flipQuestion({ flip, gameSettings, audioLibrary });};
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
    answerContainer.onclick = (e) => {selectGuess({ e, gameSettings, audioLibrary });};
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

async function postQuestion({ gameSettings, audioLibrary }){
  const questionData = await getData(gameSettings);
  gameSettings.level === 'easy' && audioHandler({ audioLibrary, sound: 'easyQuestion'});
  gameSettings.level === 'medium' && audioHandler({ audioLibrary, sound: 'mediumQuestion' });
  gameSettings.level === 'hard' && audioHandler({ audioLibrary, sound: 'hardQuestion' });
  if (gameSettings.previousQuestions.includes(questionData.question)){
    postQuestion({ gameSettings, audioLibrary });
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
    const currentRhombus = currentRound.children[1];
    currentRound.id = 'currentRound';
    currentRhombus.id = 'currentRhombus';
    console.log('Posted question gameSettings', gameSettings);
  }
}
function defaultSettings(){
  const gameSettings = {
    level: 'easy',
    category: provideCategory({}),
    round: 1,
    previousQuestions: [],
    // currentPrize: '0 €',
  };
  return gameSettings;
}

async function initPage(){
  const gameSettings = defaultSettings();
  const root = document.getElementById('root');
  const audioLibrary = getAudio();
  populatePage({ root, gameSettings, audioLibrary });
}

async function startGame({ logoContainer, gameSettings, audioLibrary }){
  logoContainer.classList.remove('startGame');
  audioHandler({ sound: 'startGame', audioLibrary })
  setTimeout(async() => {
    await postQuestion({ gameSettings, audioLibrary });
  }, 5000); 
}

initPage();

const jas = 4;

