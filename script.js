const cards = [
    { id: 1, value: 1 }, { id: 2, value: 1 },
    { id: 3, value: 2 }, { id: 4, value: 2 },
    { id: 5, value: 3 }, { id: 6, value: 3 },
    { id: 7, value: 4 }, { id: 8, value: 4 },
    { id: 9, value: 5 }, { id: 10, value: 5 },
    { id: 11, value: 6 }, { id: 12, value: 6 },
    { id: 13, value: 7 }, { id: 14, value: 7 },
    { id: 15, value: 8 }, { id: 16, value: 8 },
    { id: 17, value: 9 }, { id: 18, value: 9 },
    { id: 19, value: 10 }, { id: 20, value: 10 }
];

let firstCard, secondCard;
let lockBoard = false;
let matchedPairs = 0;
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;

document.addEventListener('DOMContentLoaded', () => {
    initGame();
    document.getElementById('replay-button').addEventListener('click', replayGame);
});

function initGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    shuffle(cards);
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = card.value;

        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">${card.value}</div>
                <div class="card-back">?</div>
            </div>
        `;

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });

    matchedPairs = 0;
    firstCard = secondCard = null;
    lockBoard = false;
    currentPlayer = 1;
    player1Score = 0;
    player2Score = 0;
    updatePlayerInfo();
    hideWinScreen();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matchedPairs++;
    if (currentPlayer === 1) {
        player1Score++;
    } else {
        player2Score++;
    }

    updatePlayerInfo();
    resetBoard();

    if (matchedPairs === cards.length / 2) {
        setTimeout(showWinScreen, 500);
    }
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');

        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updatePlayerInfo();
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function updatePlayerInfo() {
    document.getElementById('current-player').textContent = `Player ${currentPlayer}'s turn`;
    document.getElementById('player1-score').textContent = player1Score;
    document.getElementById('player2-score').textContent = player2Score;
}

function showWinScreen() {
    const winnerMessage = document.getElementById('winner-message');
    if (player1Score > player2Score) {
        winnerMessage.textContent = 'Player 1 wins!';
    } else if (player2Score > player1Score) {
        winnerMessage.textContent = 'Player 2 wins!';
    } else {
        winnerMessage.textContent = 'It\'s a tie!';
    }
    document.getElementById('win-screen').classList.remove('hidden');
}

function hideWinScreen() {
    document.getElementById('win-screen').classList.add('hidden');
}

function replayGame() {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.classList.remove('flipped'));
    hideWinScreen();
    setTimeout(initGame, 600);
}

