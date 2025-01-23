const questionContainer = document.getElementById("question-container");
const indiceContainer = document.getElementById("indices");
const answerInput = document.getElementById("answer-input");
const submitButton = document.getElementById("submit-answer");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart-game");


let currentCharacter = {};
let score = 0;
let remainingTime = 30;
let timer;
let index = 0;

async function getCharacter() {
    const characterResponse = await fetch("https://api.api-onepiece.com/v2/characters/fr");
    if (!characterResponse.ok) {
        throw new Error(`Response Status: ${response.status}`);
    }
    const characterData = await characterResponse.json();
    console.log(characterData) 
    currentCharacter = characterData[Math.floor(Math.random() * characterData.length)];
    startGame();
}

function startGame() {
    indiceContainer.innerHTML = "";
    index = 0;
    remainingTime = 45;
    // on active les boutons dans le cas ou cest une deuxieme partie et qu'ils ont été desac
    answerInput.disabled = false;
    submitButton.disabled = false;

    loadQuestion();
    startTimer();
    console.log(currentCharacter) // pour voir la reponse sans galérer 
}

function loadQuestion() {
    questionContainer.innerHTML = `
        <p>Quel est le personnage ?</p>
    `;
    afficherIndice(); 
}

function startTimer() {
    timer = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime = remainingTime - 1;
            timerDisplay.textContent = `Temps restant: ${remainingTime}s`;

            if (remainingTime % 5 === 0 ) {
                afficherIndice();
            }
        
        // compteur a 0
        } else {
            clearInterval(timer); 
            revealAnswer(); 

        }
    }, 1000);
}

function afficherIndice() {
    const indices = [
        `Âge: ${currentCharacter.age || "Inconnu"}`,
        `Prime: ${currentCharacter.bounty || "Inconnue"}`,
        `Fruit du démon: ${currentCharacter.fruit?.name || "Aucun"}`,
        `Équipage: ${currentCharacter.crew?.name || "Aucun"}`,
        `Statut: ${currentCharacter.status || "Inconnu"}`,
        `Taille: ${currentCharacter.size || "Inconnue"}`,
        `Poste: ${currentCharacter.job || "Inconnu"}`
    ];

    // pour ne pas affixher le meme indice a chaque fois 
    // les indices sont toujours dans le meme ordre ducoup
    if (index < indices.length) {
        const indice = document.createElement("p");
        indice.textContent = indices[index];
        indiceContainer.appendChild(indice);
        index++;
    }

}

function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    if (userAnswer === currentCharacter.name.toLowerCase()) {
        clearInterval(timer); 
        revealAnswer(true);
    } else {
        alert("Mauvaise réponse, cherches encore !");
    }
}

function revealAnswer() {
    // Désactiver le champ et le bouton
    answerInput.disabled = true;
    submitButton.disabled = true;

    const resultMessage = document.createElement("p");
    resultMessage.style.fontWeight = "bold"; // message de fin de jeu en gras 

    const userAnswer = answerInput.value.toLowerCase();
    if (userAnswer === currentCharacter.name.toLowerCase()) {
        resultMessage.textContent = `Gagné ! Le personnage était bien ${currentCharacter.name}.`;
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
    } else {
        resultMessage.textContent = `Dommage, vous avez perdu. Le personnage était ${currentCharacter.name}.`;
    }

    indiceContainer.appendChild(resultMessage);

    restartButton.disabled = false; // on active le bouton pour relancer la partie 
}

submitButton.addEventListener("click", checkAnswer);

restartButton.addEventListener("click", () => {
    restartButton.disabled = true; 
    getCharacter();
});

// je trouvais ca chiant d'appuyer sur le bouton a chaque fois dcp j'ai fais ca 
answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        checkAnswer();
    }
});

getCharacter();