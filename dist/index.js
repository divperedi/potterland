"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
window.addEventListener('load', () => {
    displayGreeting();
    navSetup();
    displayCharacters();
    displaySpells();
    displayPotions();
    setupBackToTopButtons();
});
function displayGreeting() {
    const greetingRef = document.querySelector('.greeting');
    if (!greetingRef)
        return null;
    typeEffect(greetingRef, 'I solemnly swear that I am up to no good');
    setTimeout(() => {
        greetingRef.textContent = '';
    }, 3000);
    return greetingRef;
}
function typeEffect(element, text, delay = 65) {
    let index = 0;
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, delay);
        }
    }
    type();
}
function navSetup() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(navItem => {
        navItem.addEventListener('click', (event) => {
            const target = event.currentTarget;
            const sectionId = target.dataset.id;
            if (sectionId) {
                toggleSectionDisplay(sectionId);
            }
        });
    });
}
function toggleSectionDisplay(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => section.classList.add('d-none'));
    const selectedSection = document.getElementById(`${sectionId}Section`);
    selectedSection === null || selectedSection === void 0 ? void 0 : selectedSection.classList.remove('d-none');
}
function displayCharacters() {
    return __awaiter(this, void 0, void 0, function* () {
        const characters = yield fetchCharacters();
        const container = document.querySelector('.characters-content');
        if (!container)
            return;
        container.innerHTML = '';
        characters.forEach(character => {
            const card = createCharacterCard(character);
            container.appendChild(card);
        });
    });
}
function displaySpells() {
    return __awaiter(this, void 0, void 0, function* () {
        const spells = yield fetchSpells();
        const container = document.querySelector('.spells-content');
        if (!container)
            return;
        container.innerHTML = '';
        spells.forEach(spell => {
            const card = createSpellCard(spell);
            container.appendChild(card);
        });
    });
}
function displayPotions() {
    return __awaiter(this, void 0, void 0, function* () {
        const potions = yield fetchPotions();
        const container = document.querySelector('.potions-content');
        if (!container)
            return;
        container.innerHTML = '';
        potions.forEach(potion => {
            const card = createPotionCard(potion);
            container.appendChild(card);
        });
    });
}
function fetchCharacters() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://hp-api.herokuapp.com/api/characters');
            if (!response.ok) {
                throw new Error('Something is wrong with your magic wand!');
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    });
}
function fetchSpells() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://hp-api.herokuapp.com/api/spells');
            if (!response.ok) {
                throw new Error('Something is wrong with your spells book!');
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    });
}
function fetchPotions() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://api.potterdb.com/v1/potions');
            if (!response.ok) {
                throw new Error('Something is wrong with your potions data!');
            }
            const data = yield response.json();
            return data.data.map(potion => ({
                name: potion.attributes.name,
                difficulty: potion.attributes.difficulty,
                ingredients: potion.attributes.ingredients || "Not specified",
                effect: potion.attributes.effect,
                image: potion.attributes.image
            }));
        }
        catch (error) {
            console.error(error);
            return [];
        }
    });
}
function createCharacterCard(character) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isFavorite = favorites.some(fav => fav.id === character.id);
    const card = document.createElement('article');
    card.classList.add('character-card');
    const heartIconSrc = isFavorite ? './heart red.png' : './heart.png';
    card.innerHTML = `
        <div class="character-card-top">
            <img src="${character.image || './HPhat.png'}" class="character-img" alt="${character.name}">
        </div>
        <div class="character-card-bottom">
            <h2>${character.name}</h2>
            ${character.species && character.species.toLowerCase() !== 'human' ? `<h3>Species: ${character.species}</h3>` : ''}
            ${character.house ? `<h3>House: ${character.house}</h3>` : ''}
            ${character.patronus ? `<p>Patronus: ${character.patronus}</p>` : ''}
            ${character.ancestry ? `<p>Ancestry: ${character.ancestry}</p>` : ''}
            ${character.wand && character.wand.wood && character.wand.core && character.wand.length ?
        `<p>Wand: ${character.wand.wood}, ${character.wand.core}, ${character.wand.length} inches</p>` : ''}
            ${character.alternate_names && character.alternate_names.length > 0 ? `<p>Alternate Names: ${character.alternate_names.join(', ')}</p>` : ''}
        </div>
        <img src="${heartIconSrc}" class="heart-icon" data-id="${character.id}" alt="Heart Icon">
    `;
    const heartIcon = card.querySelector('.heart-icon');
    heartIcon === null || heartIcon === void 0 ? void 0 : heartIcon.addEventListener('click', () => toggleFavorite(character));
    return card;
}
function toggleFavorite(character) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.findIndex(fav => fav.id === character.id);
    const heartIcon = document.querySelector(`.heart-icon[data-id="${character.id}"]`);
    if (index === -1) {
        favorites.push(character);
        console.log(`Added ${character.name} to favorites`);
        if (heartIcon) {
            heartIcon.src = './heart red.png';
        }
    }
    else {
        favorites.splice(index, 1);
        console.log(`Removed ${character.name} from favorites`);
        if (heartIcon) {
            heartIcon.src = './heart.png';
        }
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesSection();
}
function updateFavoritesSection() {
    const favoritesContainer = document.querySelector('.favourites-content');
    favoritesContainer.innerHTML = '';
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    console.log('Current favorites:', favorites);
    favorites.forEach(character => {
        const card = createCharacterCard(character);
        favoritesContainer.appendChild(card);
    });
}
(_a = document.querySelector('.nav-item[data-id="favourites"]')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    updateFavoritesSection();
});
function createSpellCard(spell) {
    const card = document.createElement('article');
    card.classList.add('spell-card');
    card.innerHTML = `
        <h2>${spell.name}</h2>
        <p>${spell.description}</p>
    `;
    return card;
}
function createPotionCard(potion) {
    const card = document.createElement('article');
    card.classList.add('potion-card');
    const potionImage = potion.image || './HPpotion.png';
    const potionEffect = potion.effect || 'No effect specified';
    card.innerHTML = `
        <div class="potion-card-top">
            <img src="${potionImage}" alt="Image of ${potion.name}">
        </div>
        <div class="potion-card-bottom">
            <h2 class="potion-card-bottom-item">${capitalizeWords(potion.name)}</h2>
            ${potion.difficulty ? `<h3 class="potion-card-bottom-item">Difficulty: ${potion.difficulty}</h3>` : ''}
            <p class="potion-card-bottom-item">Effect: ${potionEffect}</p>
            ${potion.ingredients ? `
                <h4 class="potion-card-bottom-item">Ingredients: ${potion.ingredients}</h4>
            ` : ''}
        </div>
    `;
    return card;
}
function capitalizeWords(str) {
    str = str.replace(/-/g, ' ');
    str = str.replace(/\b\w/g, match => match.toUpperCase());
    return str;
}
function setupBackToTopButtons() {
    const backToTopButtons = document.querySelectorAll('.back-to-top');
    if (backToTopButtons.length === 0) {
        console.error('Back to Top buttons not found in the DOM');
        return;
    }
    window.addEventListener('scroll', () => {
        backToTopButtons.forEach(button => {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                button.style.display = 'block';
            }
            else {
                button.style.display = 'none';
            }
        });
    });
}
function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
