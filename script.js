let score = 0;
let timeLeft = 10; // 制限時間（秒）
let countdownTime = 3; // ゲーム開始前のカウントダウン（秒）
const maxClicks = 100; // メモリバーが満杯になるまでのクリック数
let highScore = localStorage.getItem('highScore') || 0;
let rankings = JSON.parse(localStorage.getItem('rankings')) || [];

const scoreDisplay = document.getElementById('score');
const clickButton = document.getElementById('clickButton');
const startButton = document.getElementById('startButton');
const playerNameInput = document.getElementById('playerName');
const timerDisplay = document.createElement('div');
timerDisplay.id = 'timer';
timerDisplay.style.fontSize = '24px';
timerDisplay.style.marginTop = '20px';
document.getElementById('gameContainer').appendChild(timerDisplay);

const memoryBar = document.getElementById('memoryBar');

const highScoreDisplay = document.createElement('div');
highScoreDisplay.id = 'highScore';
highScoreDisplay.innerText = 'ハイスコア: ' + highScore;
document.getElementById('gameContainer').appendChild(highScoreDisplay);

const rankingList = document.getElementById('rankingList');

const clickSound = new Audio('piko.mp3');
const startSound = new Audio('start.mp3');
const endSound = new Audio('end.mp3');

const updateRankingList = () => {
    rankingList.innerHTML = '';
    rankings.forEach((rank, index) => {
        const listItem = document.createElement('li');
        listItem.innerText = `${index + 1}. ${rank.name}: ${rank.score}点`;
        rankingList.appendChild(listItem);
    });
};

const updateMemoryBar = () => {
    const barHeight = (score / maxClicks) * 100;
    memoryBar.style.height = barHeight + '%';
};

const countdown = () => {
    console.log('countdown', timeLeft); // コンソールログ追加
    if (timeLeft > 0) {
        timeLeft--;
        timerDisplay.innerText = '残り時間: ' + timeLeft + '秒';
    } else {
        endGame();
    }
};

const startGameCountdown = () => {
    console.log('startGameCountdown', countdownTime); // コンソールログ追加
    if (countdownTime > 0) {
        timerDisplay.innerText = 'ゲーム開始まで: ' + countdownTime + '秒';
        countdownTime--;
    } else {
        clearInterval(startTimer);
        startSound.play(); // スタートサウンドを再生
        setTimeout(startGame, 1000); // 1秒後にゲームを開始
    }
};

const startGame = () => {
    console.log('startGame'); // コンソールログ追加
    score = 0;
    timeLeft = 10;
    scoreDisplay.innerText = '得点: ' + score;
    timerDisplay.innerText = '残り時間: ' + timeLeft + '秒';
    clickButton.disabled = false;
    startButton.disabled = true; // ゲーム中はスタートボタンを無効にする
    timer = setInterval(countdown, 1000);
};

const updateHighScore = () => {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreDisplay.innerText = 'ハイスコア: ' + highScore;
    }
};

const updateRankings = () => {
    const playerName = playerNameInput.value.trim() || '匿名';
    rankings.push({ name: playerName, score: score });
    rankings.sort((a, b) => b.score - a.score);
    rankings = rankings.slice(0, 10); // 上位10位まで保存
    localStorage.setItem('rankings', JSON.stringify(rankings));
    updateRankingList();
};

const endGame = () => {
    console.log('endGame'); // コンソールログ追加
    clearInterval(timer);
    clickButton.disabled = true;
    timerDisplay.innerText = 'ゲーム終了！最終得点: ' + score;
    updateHighScore();
    updateRankings();
    endSound.play();
};

clickButton.addEventListener('click', () => {
    if (timeLeft > 0) {
        score++;
        scoreDisplay.innerText = '得点: ' + score;
        updateMemoryBar();
        const clickSoundInstance = new Audio('piko.mp3'); // 新しいオーディオインスタンスを作成
        clickSoundInstance.play();
        showScoreIncrease();
        clickButton.classList.add('clicked');
        setTimeout(() => clickButton.classList.remove('clicked'), 200);
    }
});

startButton.addEventListener('click', () => {
    console.log('startButton clicked'); // コンソールログ追加
    countdownTime = 3;
    startButton.disabled = true;
    startTimer = setInterval(startGameCountdown, 1000);
});

const showScoreIncrease = () => {
    const scoreIncrease = document.createElement('div');
    scoreIncrease.innerText = '+1';
    scoreIncrease.style.position = 'absolute';
    scoreIncrease.style.left = clickButton.getBoundingClientRect().left + 'px';
    scoreIncrease.style.top = clickButton.getBoundingClientRect().top + 'px';
    scoreIncrease.style.color = '#76c7c0';
    scoreIncrease.style.fontSize = '24px';
    scoreIncrease.style.transition = 'top 1s, opacity 1s';
    document.body.appendChild(scoreIncrease);

    setTimeout(() => {
        scoreIncrease.style.top = (clickButton.getBoundingClientRect().top - 50) + 'px';
        scoreIncrease.style.opacity = 0;
    }, 0);

    setTimeout(() => {
        scoreIncrease.remove();
    }, 1000);
};

// 初期化の最後にランキングリストを更新
updateRankingList();
