
const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },

    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },

    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },

    button: document.getElementById("next-duel"),
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards",
};

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Papel",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Pedra",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Tesoura",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    }, 
];

async function getRadomCardId(){
    const randomIdex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIdex].id;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRadomCardId();

    await showHiddenCardFieldsImages(true);    
    await hiddenCardDetails();
    await drawCardsInfield(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function checkDuelResults(playerCardId, computerCardId) {
    let playerCard = cardData[playerCardId];
    let duelResults = "Empate";
    
    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "Ganhou";
        await playAudio("Win");
        state.score.playerScore++;
    }

    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "Perdeu";
        await playAudio("lose");
        state.score.computerScore++;
    }

    return duelResults;
}

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard);
        });

        cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    }

    return cardImage;
}

async function removeAllCardsImages() {
    let cards = document.querySelector(".card-box.framed#computer-cards");
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    cards = document.querySelector(".card-box.framed#player-cards");
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawCards(cardNumbers, fieldSides) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRadomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSides);

        document.getElementById(fieldSides).appendChild(cardImage);
    }
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atributo: " + cardData[index].type;
}

async function drawButton(text) {
    state.button.innerText = text;
    state.button.style.display = "block";
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);

    try{
        audio.play();
    }
    catch{}
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}


async function drawCardsInfield(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldsImages(value) {
    if (value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }
    if (value === false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails() {
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
    state.cardSprites.avatar.src = "";
}

function init () {

    showHiddenCardFieldsImages(false);

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init ();