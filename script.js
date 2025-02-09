let currentNumber = 1079;
let startTime;
let timerInterval;
let metronome;
let errorCount = 0;

document.getElementById('startButton').addEventListener('click', startTest);

function startTest() {
    document.getElementById('startButton').classList.add('hidden');
    document.getElementById('testArea').classList.remove('hidden');
    startTime = Date.now();
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
    playMetronome();
    askQuestion();
}

function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const remainingTime = 300 - elapsedTime; // 5 minutes = 300 seconds
    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        endTest();
    } else {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        document.getElementById('timer').textContent = `Time remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

function playMetronome() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // 440 Hz tone
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1); // Short beep

    metronome = setInterval(() => {
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    }, 500); // 2 Hz = every 500ms
}

function askQuestion() {
    document.getElementById('question').textContent = `Subtract 13 from ${currentNumber}`;
    document.getElementById('answerInput').value = '';
    document.getElementById('feedback').textContent = '';
}

document.getElementById('submitButton').addEventListener('click', checkAnswer);

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById('answerInput').value);
    const correctAnswer = currentNumber - 13;

    if (userAnswer === correctAnswer) {
        document.getElementById('feedback').textContent = 'Correct!';
        currentNumber = correctAnswer;
    } else {
        document.getElementById('feedback').textContent = `Incorrect! The correct answer was ${correctAnswer}.`;
        document.body.classList.add('wrong-answer');
        setTimeout(() => {
            document.body.classList.remove('wrong-answer');
        }, 500); // Flash red for 500ms
        errorCount++;
    }

    askQuestion();
}

function endTest() {
    clearInterval(metronome);
    document.getElementById('testArea').classList.add('hidden');
    document.getElementById('feedback').textContent = `Test ended! The last number you reached was ${currentNumber}. You made ${errorCount} errors. This is below average for your age.`;
    document.getElementById('timer').textContent = '';
}
