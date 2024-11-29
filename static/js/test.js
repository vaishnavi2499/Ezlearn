// References
let timeLeft = document.querySelector(".time-left");
let quizContainer = document.getElementById("container");
let nextBtn = document.getElementById("next-button");
let countOfQuestion = document.querySelector(".number-of-question");
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let restart = document.getElementById("restart");
let userScore = document.getElementById("user-score");
let startScreen = document.querySelector(".start-screen");
let startButton = document.getElementById("start-button");
let questionCount;
let scoreCount = 0;
let count = 30; // Set initial countdown to 30
let countdown;

// Questions and Options array
const quizArray = [
    {
        id: "0",
        question: "Does your child struggle to read age-appropriate texts fluently, often pausing frequently or reading very slowly?",
        options: ["Never", "Rarely", "Sometimes", "Often"],
        correct: "Sometimes", // Updated answer
    },
    {
        id: "1",
        question: "Does your child have difficulty recognizing common sight words that they have been taught repeatedly?",
        options: ["Never", "Rarely", "Sometimes", "Often"],
        correct: "Often", // Correct answer
    },
    {
        id: "2",
        question: "Does your child find it challenging to break words into their individual sounds (phonemes) or blend sounds together to form words?",
        options: ["Never", "Rarely", "Sometimes", "Often"],
        correct: "Sometimes", // Updated answer
    },
    {
        id: "3",
        question: "Does your child frequently spell the same word differently on different occasions?",
        options: ["Never", "Rarely", "Sometimes", "Often"],
        correct: "Rarely", // Updated answer
    },
    {
        id: "4",
        question: "Does your child often reverse letters (e.g., b/d, p/q) or numbers (e.g., 6/9) when reading or writing?",
        options: ["Never", "Rarely", "Sometimes", "Often"],
        correct: "Often", // Correct answer
    },
    {
        id: "5",
        question: "Does your child struggle to organize their thoughts when writing, leading to disorganized or unclear writing?",
        options: ["Never", "Rarely", "Sometimes", "Often"],
        correct: "Sometimes", // Updated answer
    },
    {
        id: "6",
        question: "Does your child have trouble understanding instructions or stories read aloud, often requiring multiple explanations?",
        options: ["Never", "Rarely", "Sometimes", "Often"],
        correct: "Rarely", // Updated answer
    },
    {
        id: "7",
        question: "Does your child have difficulty remembering the names of people or places, often mixing them up or forgetting them?",
        options: ["Never", "Rarely", "Sometimes", "Often"],
        correct: "Sometimes", // Updated answer
    },
    {
        id: "8",
        question: "Does your child struggle to learn and use new vocabulary words, often forgetting them shortly after being introduced?",
        options: ["Never", "Rarely", "Sometimes", "Often"],
        correct: "Often", // Correct answer
    },
    {
        id: "9",
        question: "Does your child tend to avoid activities that involve reading or writing, expressing frustration or reluctance to participate?",
        options: ["Never", "Rarely", "Sometimes", "Often"],
        correct: "Rarely", // Updated answer
    },
];


// Restart Quiz
restart.addEventListener("click", () => {
    initial();
    displayContainer.classList.remove("hide");
    scoreContainer.classList.add("hide");
});

// Next Button
nextBtn.addEventListener(
    "click",
    (displayNext = () => {
        // Increment questionCount
        questionCount += 1;

        // If last question
        if (questionCount == quizArray.length) {
            // Hide question container and display score
            displayContainer.classList.add("hide");
            scoreContainer.classList.remove("hide");

            // User score without revealing correct answers
            userScore.innerHTML = "<div style='text-align: center'>" +
                "Your score is " + scoreCount + " out of " + questionCount + 
                "<br>(Try taking expert advice about dyslexia if your score is 5 or more than 5)";
        } else {
            // Display questionCount
            countOfQuestion.innerHTML =
                questionCount + 1 + " of " + quizArray.length + " Question";
            // Display quiz
            quizDisplay(questionCount);
            count = 30; // Set timer back to 30 seconds
            clearInterval(countdown);
            timerDisplay(); // Restart timer
        }
    })
);

// Timer
const timerDisplay = () => {
    let count = 30; // Set countdown to 30 seconds
    countdown = setInterval(() => {
        count--;
        timeLeft.innerHTML = `${count}s`;
        if (count == 0) {
            clearInterval(countdown);
            displayNext();
        }
    }, 1000);
};

// Display quiz
const quizDisplay = (questionCount) => {
    let quizCards = document.querySelectorAll(".container-mid");
    // Hide other cards
    quizCards.forEach((card) => {
        card.classList.add("hide");
    });
    // Display current question card
    quizCards[questionCount].classList.remove("hide");
};

// Quiz Creation
function quizCreator() {
    // Randomly sort questions
    quizArray.sort(() => Math.random() - 0.5);
    // Generate quiz
    for (let i of quizArray) {
        // Randomly sort options
        i.options.sort(() => Math.random() - 0.5);
        // Quiz card creation
        let div = document.createElement("div");
        div.classList.add("container-mid", "hide");
        // Question number
        countOfQuestion.innerHTML = 1 + " of " + quizArray.length + " Question";
        // Question
        let question_DIV = document.createElement("p");
        question_DIV.classList.add("question");
        question_DIV.innerHTML = i.question;
        div.appendChild(question_DIV);
        // Options
        div.innerHTML += `
            <button class="option-div" onclick="checker(this)">${i.options[0]}</button>
            <button class="option-div" onclick="checker(this)">${i.options[1]}</button>
            <button class="option-div" onclick="checker(this)">${i.options[2]}</button>
            <button class="option-div" onclick="checker(this)">${i.options[3]}</button>
        `;
        quizContainer.appendChild(div);
    }
}

// Checker Function to check if option is correct or not
// Checker Function to check if option is correct or not
function checker(userOption) {
    let userSolution = userOption.innerText;
    let question =
        document.getElementsByClassName("container-mid")[questionCount];
    let options = question.querySelectorAll(".option-div");

    // Increment score if the answer is correct
    if (userSolution === quizArray[questionCount].correct) {
        scoreCount++; // Increment score for correct answers
    }

    // Clear interval (stop timer)
    clearInterval(countdown);
    // Disable all options without showing correct/incorrect feedback
    options.forEach((element) => {
        element.disabled = true;
    });

    // Move to the next question after a delay (optional)
    setTimeout(() => {
        displayNext();
    }, 1000); // Change delay time as needed
}


// Initial setup
function initial() {
    quizContainer.innerHTML = "";
    questionCount = 0;
    scoreCount = 0;
    count = 30; // Reset countdown to 30 seconds
    clearInterval(countdown);
    timerDisplay();
    quizCreator();
    quizDisplay(questionCount);
}

// When user clicks on start button
startButton.addEventListener("click", () => {
    startScreen.classList.add("hide");
    displayContainer.classList.remove("hide");
    initial();
});

// Hide quiz and display start screen
window.onload = () => {
    startScreen.classList.remove("hide");
    displayContainer.classList.add("hide");
};
