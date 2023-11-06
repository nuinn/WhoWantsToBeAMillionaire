async function getData({ level, category }){
  const url = `https://quiz-api-ofkh.onrender.com/questions/random?level=${level}&category=${category}`;
  const response = await fetch(url);
  const data = await response.json();
  const questionObject = {};
  questionObject.question = data.description;
  questionObject.answers = data.answers;
  questionObject.correct = data.correctAnswer;
  console.log(questionObject);
}
const gameSettings = {
  level: 'easy',
  category: 'css'
};

getData(gameSettings);

function populatePage(container){
  const top = document.createElement('div');
  const bottom = document.createElement('div');
  top.classList.add('top');
  bottom.classList.add('bottom');
  container.appendChild(top);
  container.appendChild(bottom);
}

function initPage(){
  const root = document.getElementById('root');
  const container = document.createElement('div');
  container.id = 'container';
  root.appendChild(container);
  populatePage(container);
}

initPage();