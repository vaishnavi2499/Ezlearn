let score = 0;
const cards = [
    { name: 'A', img: '/static/images/bed.png' },
    { name: 'B', img: '/static/images/block.png' },
    { name: 'C', img: '/static/images/board.png' },
    { name: 'D', img: '/static/images/book.png' },
    { name: 'E', img: '/static/images/bottle.png' },
    { name: 'F', img: '/static/images/bowl.png' },
    { name: 'J', img: '/static/images/bread.png' },
    { name: 'K', img: '/static/images/bucket.png' },
    { name: 'L', img: '/static/images/card.png' },
    { name: 'M', img: '/static/images/chair.png' },
    { name: 'N', img: '/static/images/cup.png' },
    { name: 'O', img: '/static/images/default.png' },
    { name: 'P', img: '/static/images/desk.png' },
    { name: 'Q', img: '/static/images/desktop.png' },
    { name: 'R', img: '/static/images/doll.png' },
    { name: 'S', img: '/static/images/drone.png' },
    { name: 'T', img: '/static/images/drum.png' },
    { name: 'U', img: '/static/images/keyboard.png' },
    { name: 'V', img: '/static/images/lamp.png' },
    { name: 'Z', img: '/static/images/phone.png' },
    
    { name: 'A', img: '/static/images/bed.png' },
    { name: 'B', img: '/static/images/block.png' },
    { name: 'C', img: '/static/images/board.png' },
    { name: 'D', img: '/static/images/book.png' },
    { name: 'E', img: '/static/images/bottle.png' },
    { name: 'F', img: '/static/images/bowl.png' },
    { name: 'J', img: '/static/images/bread.png' },
    { name: 'K', img: '/static/images/bucket.png' },
    { name: 'L', img: '/static/images/card.png' },
    { name: 'M', img: '/static/images/chair.png' },
    { name: 'N', img: '/static/images/cup.png' },
    { name: 'O', img: '/static/images/default.png' },
    { name: 'P', img: '/static/images/desk.png' },
    { name: 'Q', img: '/static/images/desktop.png' },
    { name: 'R', img: '/static/images/doll.png' },
    { name: 'S', img: '/static/images/drone.png' },
    { name: 'T', img: '/static/images/drum.png' },
    { name: 'U', img: '/static/images/keyboard.png' },
    { name: 'V', img: '/static/images/lamp.png' },
    { name: 'Z', img: '/static/images/phone.png' },
    
];


let cardElements = [];
let firstCard, secondCard;
let lockBoard = false;
let matchedCards = 0;

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function createCard(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.name = card.name;
    cardElement.innerHTML = '?';


    const imgElement = document.createElement('img');
    imgElement.src = card.img; 
    imgElement.alt = card.name; 

    imgElement.style.display = 'none'; 
    cardElement.appendChild(imgElement);

    const overlay = document.createElement('span');
    overlay.classList.add('overlay');
    overlay.innerText = '?'; 
    cardElement.appendChild(overlay);

    cardElement.addEventListener('click', flipCard);

    return cardElement;
}

function flipCard() {
    if (lockBoard) return;

    this.classList.add('flipped');

    const img = this.querySelector('img');
    img.style.display = 'block'; 
    const overlay = this.querySelector('.overlay');
    overlay.style.display = 'none'; 
    

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkMatch();
}


function checkMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.style.pointerEvents = 'none';
    secondCard.style.pointerEvents = 'none';
    score = score+2;
    matchedCards += 2;
    document.getElementById("scoreDisplay").innerText = score; // Update the score display

    
    resetBoard();
    if (matchedCards === 8) {
        document.getElementById('result').innerText = "You found all matches!";
        const xhr = new XMLHttpRequest();
            xhr.open("POST", saveScoreUrl, true);  
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('X-CSRFToken', '{{ csrf_token }}');  
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log("Score saved successfully!");
                }
            };
        
            const data = JSON.stringify({
                'score': score,
                'game_name': 'Flashcard matching Game'  
            });
            xhr.send(data);
    }
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');

      
        const img1 = firstCard.querySelector('img');
        const img2 = secondCard.querySelector('img');
        img1.style.display = 'none'; // Hide image
        img2.style.display = 'none'; // Hide image

        const overlay1 = firstCard.querySelector('.overlay');
        const overlay2 = secondCard.querySelector('.overlay');
        overlay1.style.display = 'block'; // Show overlay
        overlay2.style.display = 'block'; // Show overlay

        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];

}

function startGame() {
    matchedCards = 0;
    document.getElementById('result').innerText = '';
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    
    shuffle(cards);

    // Select 8 unique pairs
    const selectedPairs = [];
    const uniqueNames = new Set();
    
    for (let card of cards) {
        if (!uniqueNames.has(card.name)) {
            uniqueNames.add(card.name);
            selectedPairs.push(card);
            const pair = cards.find(c => c.name === card.name && c !== card);
            selectedPairs.push(pair);
        }
        if (selectedPairs.length === 8) break; 
    }

    shuffle(selectedPairs); 
    selectedPairs.forEach(card => {
        const cardElement = createCard(card);
        gameBoard.appendChild(cardElement);
    });
    score = 0;
    document.getElementById("scoreDisplay").innerText = score;
}



document.getElementById('resetButton').addEventListener('click', startGame);

startGame();