const characterContainer = document.getElementById("character-container");
const searchBar = document.getElementById("search-bar");

async function getCharacters() {
    const characterResponse = await fetch("https://api.api-onepiece.com/v2/characters/fr");
    if (!characterResponse.ok) {
        throw new Error(`Response Status: ${response.status}`);
    }
    const characterData = await characterResponse.json();
    console.log(characterData)
    afficherCharacters(characterData);
}

function afficherCharacters(characters) {
    characterContainer.innerHTML = "";  // obligé ed mettre ca car sinon un personnage peut apparaitre plusieurs fois 
    characters.forEach(character => {
        const card = document.createElement("div"); //  Desing pour l'afficher sous forme de carte
        card.classList.add("character-card");   // ajout class css pour design encore
        card.innerHTML = 
            `<h3>${character.name}</h3>
            <p>Age :${character.age}</p>
            <p>${character.size}</p>
            <p>Camps : ${character.crew?.name || "Inconnu"}</p>
            <p>Fruit :${character.fruit?.roman_name || "Pas de fruit"} </p>
            <p>Prime :${character.bounty}</p>
            <p>Status : ${character.status || "Inconnu"}</p>`;
        characterContainer.appendChild(card);
    });
}

// Cette section ma pris beaucoup de temps parce que le texte que je passais
//  dans barre de recherche etait en minuscule et celui dans l'api avais une Maj au debut donc ca marchait pas....
searchBar.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const allCharacters = document.querySelectorAll(".character-card");
    allCharacters.forEach(card => {
        const name = card.querySelector("h3").textContent.toLowerCase();
        if (name.includes(searchTerm)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});

getCharacters();