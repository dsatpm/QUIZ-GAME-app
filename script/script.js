// DOM selectors
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answers');
const timerEl = document.getElementById('countdown');
const initEl = document.getElementById('startGame');
const quizDisplayEl = document.getElementById('quizDisplay');
const scoresEl = document.getElementById('highScores');
const recordInitials = document.querySelector('#highScoreForm');
const inputInitials = document.getElementById('initials');

// Intervals
let startClockInterval;
let startGameInterval;

// Game variables
let untilStart;
let gameIsRunning = false;
let clockTime;
let currentIndex = 0;
let scoreTotal = 0;
const questions = [
	{
		question:
			'Has anyone really been far even as decided to use even go want to do look more like?',
		image: '../assets/images/notsureif.jpg',
		imageAlt: 'Confused Fry',
		choices: ['What?', 'Yes.', 'GOT EEM.', 'Snip, snap, zap.'],
		correctChoice: 2,
	},

	{
		question: "Why is Max 'Mad' in the movie 'Mad Max'?",
		image: '../assets/images/madmax.jpg',
		imageAlt: 'Mad Max tied to front of car.',
		choices: [
			'He stubbed his toe',
			'He had to go to the DMV',
			'His wife and child were murdered',
			'He got called into work on his day off',
		],
		correctChoice: 2,
	},

	{
		question:
			'Which US state has the largest coastline along the Pacific Ocean?',
		image: '../assets/images/coastline.jpg',
		imageAlt: 'A coastline',
		choices: ['California', 'Florida', 'Texas', 'Alaska'],
		correctChoice: 3,
	},

	{
		question: 'What is the name of the eon we are living in?',
		image: '../assets/images/eon.jpg',
		imageAlt: 'Human evolution',
		choices: ['Paleozoic', 'Jurassic', 'Anthropozoic', 'Phanerozoic'],
		correctChoice: 3,
	},

	{
		question: 'What part of a sea urchin is edible?',
		image: '../assets/images/sea-urchin.jpg',
		imageAlt: 'A sea urchin',
		choices: ['Eyes', 'Feet', 'Gonads', 'Lungs'],
		correctChoice: 2,
	},

	{
		question: "What Russian composier wrote the ballet 'Swan Lake'?",
		image: '../assets/images/swan-lake.jpg',
		imageAlt: 'Swan Lake ballet performer',
		choices: ['Tchaikovsky', 'Stravinsky', 'Rachmaninoff', 'Shostakovich'],
		correctChoice: 0,
	},

	{
		question: 'What is the axilla better known as?',
		image: '../assets/images/body.jpg',
		imageAlt: 'The human body',
		choices: ['Armpit', 'Heel', 'Collar', 'Ear lobe'],
		correctChoice: 0,
	},

	{
		question: 'A group of hippopotamuses is called: ',
		image: '../assets/images/hippo.jpg',
		imageAlt: 'A bloat of hippos',
		choices: ['a pod', 'a pot', 'a bloat', 'a group'],
		correctChoice: 2,
	},

	{
		question: 'What city hosted the Winter Olympics in 1932?',
		image: '../assets/images/winter.jpg',
		imageAlt: 'Winter Olympics Logo',
		choices: [
			'The Winter Olympics had not been invented yet',
			'Lake Placid',
			'Tokyo',
			'Portland, Oregon',
		],
		correctChoice: 1,
	},

	{
		question:
			"Which Stephen King novel has the characters 'Paul Sheldon' and 'Annie Wilkes'?",
		image: '../assets/images/stephen-king.jpg',
		imageAlt: 'Young Stephen King',
		choices: ['Pet Sematary', 'The Shining', 'Cujo', 'Misery'],
		correctChoice: 3,
	},
];
let highScores = JSON.parse(localStorage.getItem('bestScores')) || [];

// Reset game state
function resetGame() {
	clearInterval(startClockInterval);
	clearInterval(startGameInterval);
	gameIsRunning = false;
	currentIndex = 0;
	scoreTotal = 0;
	clear();
}

// Display countdown before the game starts
function countdown() {
	untilStart = 3;
	initEl.textContent = untilStart;
	startClockInterval = setInterval(function () {
		untilStart--;

		if (untilStart > 0) {
			initEl.textContent = untilStart;
		} else if (untilStart === 0) {
			initEl.textContent = 'GO!';
		} else {
			initEl.textContent = 'End Game';
			clearInterval(startClockInterval);
			gamePlay();
		}
	}, 1000);
}

// Sets game timer and counts down 1 unit per second
function gameTimer() {
	clearInterval(startClockInterval);
	timerEl.textContent = clockTime;
	startGameInterval = setInterval(function () {
		clockTime--;
		if (clockTime >= 0) {
			timerEl.textContent = clockTime;
		} else {
			clearInterval(startGameInterval);
			timerEl.innerHTML = '0';
			endGame();
		}
	}, 1000);
}

// Play the game
function gamePlay() {
	if (currentIndex < questions.length && clockTime >= 0) {
		gameTimer();
		displayQuestion();
	} else {
		timerEl.innerHTML = '0';
		endGame();
		totalScore();
	}
}

// End the game
function endGame() {
	clearInterval(startGameInterval);
	clearInterval(startClockInterval);
	gameIsRunning = false;
	clear();
}

// Display the current question
function displayQuestion() {
	clear();
	const currentQuestion = questions[currentIndex];
	questionEl.textContent = currentQuestion.question;
	createImageContainer(currentQuestion.image, currentQuestion.imageAlt);
	answerChoices(currentQuestion.choices);
}

// Create an image container and append image with alt to screen
function createImageContainer(imageSrc, imageAlt) {
	const imageContainer = document.createElement('div');
	imageContainer.style.marginBottom = '28px';
	imageContainer.style.paddingBottom = '20px';
	imageContainer.style.height = '150px';
	imageContainer.style.width = '280px';
	const createImage = document.createElement('img');
	createImage.src = imageSrc;
	createImage.alt = imageAlt;
	createImage.style.height = 'auto';
	createImage.style.width = '100%';
	imageContainer.appendChild(createImage);
	quizDisplayEl.appendChild(imageContainer);
}

// Display answer choices
function answerChoices(choices) {
	const answerListContainer = document.createElement('div');
	for (let i = 0; i < choices.length; i++) {
		const choiceButton = createChoiceButton(choices[i]);
		answerListContainer.appendChild(choiceButton);
	}
	answerEl.appendChild(answerListContainer);
}

// Create a choice button
function createChoiceButton(choice) {
	const choiceButton = document.createElement('button');
	choiceButton.textContent = choice;
	choiceButton.addEventListener('click', function () {
		checkAnswer(choice);
	});
	return choiceButton;
}

// Check answer for correct answer
function checkAnswer(selectedChoice) {
	const currentQuestion = questions[currentIndex];
	if (
		selectedChoice ===
		currentQuestion.choices[currentQuestion.correctChoice]
	) {
		scoreTotal += 10;
	} else {
		scoreTotal -= 5;
		clockTime -= 5;
	}
	currentIndex++;
}

// Display total score
function totalScore() {
	quizDisplayEl.innerHTML = `Game over. Your score was:<br>${score}`;
	quizDisplayEl.style.textAlign = 'center';
	initEl.textContent = 'Play Again!';
	recordInitials.style.display = 'block';
}

recordInitials.addEventListener('submit', function (event) {
	event.preventDefault();

	const playerInitials = inputInitials.value.toUpperCase();

	highScores.push({ initials: playerInitials, score: scoreTotal });
	highScores.sort((a, b) => b.score - a.score);
	highScores = highScores.slice(0, 10);

	localStorage.setItem('bestScores', JSON.stringify(highScores));

	displayHighScores();
});

// Lists high scores to the leaderboard
function displayHighScores() {
	scoresEl.innerHTML = '';

	const listScores = document.createElement('ul');
	scoresEl.appendChild(listScores);

	for (let i = 0; i < highScores.length; i++) {
		const entry = highScores[i];
		const scoreItem = document.createElement('li');
		scoreItem.style.listStyle = 'number';
		scoreItem.style.padding = '20px';
		scoreItem.style.fontWeight = 'bold';
		scoreItem.textContent = `${entry.initials}: ${entry.score}`;
		listScores.appendChild(scoreItem);
	}
}

// Clear text and images from screen
function clear() {
	questionEl.textContent = '';
	answerEl.innerHTML = '';
	quizDisplayEl.innerHTML = '';
}

// Event listener to start and end the game
initEl.addEventListener('click', function () {
	if (gameIsRunning) {
		endGame();
		timerEl.style.textAlign = 'center';
		timerEl.innerHTML = `Game Over.<br>Click play to try again.<br> Score: 0`;
		initEl.textContent = 'Play';
	} else {
		endGame();
		recordInitials.style.display = 'none';
		timerEl.innerHTML = '';
		untilStart = 4;
		clockTime = 30;
		currentIndex = 0;
		countdown();
		gameIsRunning = true;
	}
});

displayHighScores();
