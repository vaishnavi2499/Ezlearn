let score = 0;
let matchedCards = 0;
let gameActive = false;
let prac = [];

// Start or End the game
function changeGame() {
    const startButton = document.getElementById("chan");
    if (!gameActive) {
        matchedCards = 0;
        prac = [];
        document.getElementById("score").innerText = score;
        document.getElementById("feedback").innerText = '';
        startButton.innerText = 'End Game';
        gameActive = true;
        generateDynamicNumbers();
    } else {
        endGame();
    }
}

// Dynamically generate numbers and apples
function generateDynamicNumbers() {
    const numberContainer = document.getElementById("number-container");
    const appleContainer = document.getElementById("apple-container");
    
    numberContainer.innerHTML = '';
    appleContainer.innerHTML = '';
    
    const numbers = [];
    for (let i = 1; i <= 22; i++) {
        numbers.push(i);
    }

    // Shuffle the numbers and select 5
    numbers.sort(() => Math.random() - 0.5);
    const selectedNumbers = numbers.slice(0, 5);

    selectedNumbers.forEach(number => {
        // Create number card
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('draggable', 'true');
        card.setAttribute('data-match', number);
        card.innerText = number;
        numberContainer.appendChild(card);

        // Create apple group
        const appleGroup = document.createElement('div');
        appleGroup.classList.add('apple-group');
        appleGroup.setAttribute('data-match', number);
        
        for (let i = 0; i < number; i++) {
            const apple = document.createElement('div');
            apple.classList.add('apple');
            appleGroup.appendChild(apple);
        }
        appleContainer.appendChild(appleGroup);
    });

    enableDrag();
}

// Drag and Drop Functionality
function enableDrag() {
    const cards = document.querySelectorAll('.card');
    const dropZones = document.querySelectorAll('.apple-group');

    let draggedItem = null;

    cards.forEach(card => {
        card.addEventListener('dragstart', function() {
            draggedItem = card;
            setTimeout(() => {
                card.style.display = 'none';
            }, 0);
        });

        card.addEventListener('dragend', function() {
            setTimeout(() => {
                card.style.display = 'block';
                draggedItem = null;
            }, 0);
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
        });

        zone.addEventListener('dragenter', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '#ddd';
        });

        zone.addEventListener('dragleave', function() {
            this.style.backgroundColor = '#f9f9f9';
        });

        zone.addEventListener('drop', function() {
            this.style.backgroundColor = '#f9f9f9';

            // Check if dragged item matches the drop zone
            if (draggedItem && draggedItem.getAttribute('data-match') === this.getAttribute('data-match')) {
                this.appendChild(draggedItem);
                draggedItem.setAttribute('draggable', 'false');
                score++;
                matchedCards++;
                document.getElementById('score').innerText = score;
                checkGameStatus();
            } else {
                prac.push(draggedItem.innerText); // Add incorrect match to practice
            }
        });
    });
}

// Check if all cards are matched correctly
function checkGameStatus() {
    if (matchedCards === 5) {
        document.getElementById('feedback').textContent = "Congratulations! You've matched all numbers!";
        endGame();
        const xhr = new XMLHttpRequest();
        xhr.open("POST", saveScoreUrl , true);  // 'save_score' should be the Django URL name
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('X-CSRFToken', '{{ csrf_token }}');  // Include CSRF token for security
    
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Score saved successfully!");
            }
        };
    
        const data = JSON.stringify({
            'score': score,
            'game_name': 'Number Matching Game'  
        });
        xhr.send(data);
    }
}

// End the game and send score to the server
function endGame() {
    gameActive = false;
    document.getElementById("chan").innerText = "Start";
    
    // Display feedback
    const feedback = prac.length > 0 ? `You need to practice: ${prac.join(', ')}` : "Great job!";
    document.getElementById('feedback').innerText = feedback;

    // Send score to server (Django integration)
    const n = document.getElementById("chan");
            n.innerText = "Start";
            n.setAttribute('onclick', 'changeGame()');
            gameActive = false; 
         
        

    // Reset score for the next session
    score = 0;
    matchedCards = 0;
    document.getElementById("score").innerText = score;
}
