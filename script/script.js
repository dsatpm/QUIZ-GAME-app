// DOM selectors
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answers');
const timerEl = document.getElementById('countdown');
const initEl = document.getElementById('startGame');
const quizDisplayEl = document.getElementById('quizDisplay');
const gameScoreEl = document.getElementById('gameScore');
const scoresEl = document.getElementById('highScores');
const recordInitials = document.querySelector('#highScoreForm');
const inputInitials = document.getElementById('initials');

// Intervals
let startClockInterval;
let startGameInterval;

// Game variables
let untilStart = 0;
let gameIsRunning = false;
let clockTime = 0;
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

// Pulls top scores from local storage
let highScores = JSON.parse(localStorage.getItem('bestScores')) || [];

// Clear text and images from screen
function clear() {
	questionEl.textContent = '';
	answerEl.innerHTML = '';
	quizDisplayEl.innerHTML = '';
}

// Display countdown before the game starts
function countdown() {
	initEl.textContent = untilStart;
	startClockInterval = setInterval(function () {
		if (untilStart > 0) {
			initEl.textContent = untilStart--;
		} else {
			initEl.textContent = 'End Game';
			clearInterval(startClockInterval);
			gameLoop();
		}
	}, 1000);
	gameScoreEl.style.display = 'none';
}

// Starts game loop and iterates through questions
function gameLoop() {
	if (currentIndex < questions.length && clockTime > 0) {
		displayQuestion();
		timerEl.textContent = clockTime;
		startGameInterval = setInterval(function () {
			if (clockTime >= 0 && currentIndex < questions.length) {
				timerEl.textContent = clockTime--;
			} else {
				clearInterval(startGameInterval);
				timerEl.innerHTML = '';
				gameScoreEl.style.display = 'block';
				endGame();
			}
		}, 1000);
	} else {
		endGame();
	}
}

// End the game
function endGame() {
	clearInterval(startGameInterval);
	clearInterval(startClockInterval);
	gameIsRunning = false;
	initEl.innerHTML = 'Play';
	clear();
	gameScore();
}

// Display the current question
function displayQuestion() {
	clear();
	const currentQuestion = questions[currentIndex];
	questionEl.textContent = currentQuestion.question;
	createImageContainer(currentQuestion.image, currentQuestion.imageAlt);
	answerChoices(currentQuestion.choices);

	if (clockTime === 0) {
		questionEl.innerHTML = '';
		recordInitials.style.display = 'block';
	}
}

// Create an image container and append image with alt to screen
function createImageContainer(imageSrc, imageAlt) {
	const imageContainer = document.createElement('div');
	imageContainer.style.height = '200px';
	imageContainer.style.width = '300px';
	const createImage = document.createElement('img');
	createImage.src = imageSrc;
	createImage.alt = imageAlt;
	createImage.style.height = '100%';
	createImage.style.width = '100%';
	imageContainer.appendChild(createImage);
	quizDisplayEl.appendChild(imageContainer);
}

// Display answer choices
function answerChoices(choices) {
	const answerListContainer = document.createElement('div');
	for (const choice of choices) {
		const choiceButton = createChoiceButton(choice);
		answerListContainer.appendChild(choiceButton);
	}
	answerEl.appendChild(answerListContainer);
}

// Create a choice button
function createChoiceButton(selectedChoice) {
	const choiceButton = document.createElement('button');
	choiceButton.textContent = selectedChoice;
	choiceButton.addEventListener('click', function () {
		checkAnswer(selectedChoice);
	});
	return choiceButton;
}

// Check answer for correct answer
function checkAnswer(selectedChoice) {
	const currentQuestion = questions[currentIndex];
	if (selectedChoice === currentQuestion.choices[currentQuestion.correctChoice]) {
			scoreTotal += 10;
	} else {
		scoreTotal -= 5;
		clockTime -= 5;
	}
	currentIndex++;
	displayQuestion();
}

function gameScore() {
	if (scoreTotal === 100) {
		timerEl.textContent = '';
		gameScoreEl.style.display = 'block';
		gameScoreEl.innerHTML = `PERFECT SCORE!<br>Score: ${scoreTotal}`;
		recordInitials.style.display = 'block';
	} else if (scoreTotal >= 70 && scoreTotal < 100) {
		timerEl.textContent = '';
		gameScoreEl.style.display = 'block';
		gameScoreEl.innerHTML = `DE-CENT SCORE!<br>Score: ${scoreTotal}`;
		recordInitials.style.display = 'block';
	} else if (scoreTotal < 70 && scoreTotal >= 40) {
		timerEl.textContent = '';
		gameScoreEl.style.display = 'block';
		gameScoreEl.innerHTML = `Eh. You did fine.<br>Score: ${scoreTotal}`;
		recordInitials.style.display = 'block';
	} else if (clockTime > 0 || scoreTotal < 40) {
		timerEl.textContent = '';
		gameScoreEl.style.display = 'block';
		gameScoreEl.innerHTML = `Don't quit your day job...<br>Score: ${scoreTotal}`;
		recordInitials.style.display = 'block';
	}
}

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

recordInitials.addEventListener('submit', function (event) {
	event.preventDefault();

	const playerInitials = inputInitials.value.toUpperCase();

	highScores.push({ initials: playerInitials, score: scoreTotal });
	highScores.sort((a, b) => b.score - a.score);
	highScores = highScores.slice(0, 10);

	localStorage.setItem('bestScores', JSON.stringify(highScores));

	displayHighScores();
	recordInitials.style.display = 'none'; // Hides high score submission after user enters initials
});

// Event listener to start and end the game
initEl.addEventListener('click', function () {
	if (gameIsRunning) {
		endGame();
		if (clockTime > 0) {
			recordInitials.style.display = 'none';
			questionEl.textContent = 'Wow, too chicken?';
			gameScoreEl.innerHTML = `You don't get to join the elite leaderboard.<br>Score: 0`;
		} else {
		recordInitials.style.display = 'block';
		timerEl.style.textAlign = 'center';
		initEl.textContent = 'Play';
	} }
	else {
		endGame();
		recordInitials.style.display = 'none';
		timerEl.innerHTML = '';
		untilStart = 3;
		clockTime = 30;
		scoreTotal = 0;
		currentIndex = 0;
		countdown();
		gameIsRunning = true;
	}
});

// Displays High Scores constantly to viewport
displayHighScores();
