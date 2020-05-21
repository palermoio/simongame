let gamePlayState = false;  // The play state of the game. If false, the game isn't being played. Listen for button press to start game. If true, game is in progress.
let gameSequence = [];  // The Simon sequence for the player to repeat. Numbers 1 through 4 correspond with colours. Red/W = 1, Yellow/A = 2, Blue/S = 3, Green/D = 4
let sequencePos = 0;    // Player's position in the sequence when repeating. Reset once successfully completing the sequence.
let curScore = 0;   // Current player score
localStorage.setItem("highScore", "0");

// Sounds played when buttons clicked
const audioRed = new Audio("sounds/red.wav");
const audioYellow = new Audio("sounds/yellow.wav");
const audioGreen = new Audio("sounds/green.wav");
const audioBlue = new Audio("sounds/blue.wav"); 
const audioLose = new Audio("sounds/lose.mp3");

// Function to add a new element to the sequence array.
function generateSequence() {  
    sequencePos = 0;    // Reset player position in sequence
    const newValue = Math.ceil(Math.random() * 4);
    gameSequence.push(newValue);

    // Display new button in sequence to user
    if (newValue === 1) {
        clicked("red");
    } else if (newValue === 2) {
        clicked("yellow");
    } else if (newValue === 3) {
        clicked("green");
    } else if (newValue === 4) {
        clicked("blue");
    }
}

// Function to update graphics
function updateGUI() {
    if (gamePlayState === false) {  // Check for game over
        $("#game-status").text("Game over! Press any key to play again.");
    } else {
        $("#game-status").text("");
    }
    $("#scores").text(`Current Score: ${curScore} | High Score: ${localStorage.getItem("highScore")}`)  // Update score
}

// Function to reset the game after the player loses.
function resetGame() {
    gameSequence = [];
    curScore = 0;
    sequencePos = 0;
    gamePlayState = false;
    updateGUI();
}

// Function to start a new game
function startGame() {
    gamePlayState = true;
    updateGUI();
    generateSequence();
}

// Function to check if player input is valid
function checkValid(input) {
    if (input === "red" || input === "w") {

        if (gameSequence[sequencePos] === 1) {
            clicked("red");
            correct("red");
        } else {
            incorrect("red");
            resetGame();
        }

    } else if (input === "yellow" || input === "a") {

        if (gameSequence[sequencePos] === 2){
            clicked("yellow");
            correct("yellow");
        } else {
            incorrect("yellow");
            resetGame();
        }

    } else if (input === "green" || input === "s") {

        if (gameSequence[sequencePos] === 3){
            clicked("green");
            correct("green");
        } else {
            incorrect("green");
            resetGame();
        }

    } else if (input === "blue" || input === "d") {

        if (gameSequence[sequencePos] === 4){
            clicked("blue");
            correct("blue");
        } else {
            incorrect("blue");
            resetGame();
        }

    }
}

// Function called for correct key press
function correct(className) {

    if(sequencePos === gameSequence.length - 1) {   //Reached end of sequence successfully, add to sequence
        curScore += 1;  // Update current score

        if (curScore > parseInt(localStorage.getItem("highScore"))) {
            localStorage.setItem("highScore", curScore.toString());   // Update high score if necessary.
        }

        updateGUI();

        setTimeout(function() {
            generateSequence();
        }, 1250);
    } else {
        sequencePos++;
    }
    
}

// Function called for incorrect key press
function incorrect(className){
    audioLose.play();
    resetGame();
    $(`.${className}`)[0].classList.add("btn-pressed-fail");
    setTimeout(function() {
        $(`.${className}`)[0].classList.remove("btn-pressed-fail");
    }, 1000);
}

// Function to show button clicked
function clicked(className) {
    if (className === "red") {
        audioRed.play();
    } else if (className === "yellow") {
        audioYellow.play();
    } else if (className === "green") {
        audioGreen.play();
    } else if (className === "blue") {
        audioBlue.play();
    }

    $(`.${className}`)[0].classList.add("btn-pressed");
    setTimeout(function() {
        $(`.${className}`)[0].classList.remove("btn-pressed");
    }, 200);
}

// Key press listener
$(document).keydown(function(e) {
    if(gamePlayState === false) {     //Start new game if game isn't started
        startGame();
    } else {    //Check if valid key press
        if(e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d"){
            checkValid(e.key);
        }
    }
});

// Button click listener
$(".btn").click(function(e) {
    if(gamePlayState === true) {
        checkValid(e.currentTarget.classList[1]);
    }
    
})