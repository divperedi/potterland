window.addEventListener('load', () : void => {
    displayGreeting();
    navSetup();
    displayCharacters();
    displaySpells();
    displayPotions();
    setupBackToTopButtons();
});

function displayGreeting(): HTMLElement | null {
    const greetingRef = document.querySelector('.greeting') as HTMLElement | null;
    if (!greetingRef) return null;

    typeEffect(greetingRef, 'I solemnly swear that I am up to no good');

    setTimeout(() => {
        greetingRef.textContent = '';
    }, 3000);
    
    return greetingRef;
}

function typeEffect(element: HTMLElement, text: string, delay: number = 65) : void {
    let index : number = 0;
    function type() : void {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, delay);
        }
    }
    type();
}

function navSetup(): void {
    const navItems = document.querySelectorAll('.nav-item') as NodeListOf<HTMLElement>;
    navItems.forEach(navItem => {
        navItem.addEventListener('click', (event: MouseEvent) => {
            const target = event.currentTarget as HTMLElement;
            const sectionId = target.dataset.id as string | undefined;
            if (sectionId) {
                toggleSectionDisplay(sectionId);
            }
        });
    });
}

function toggleSectionDisplay(sectionId: string): void {
    const sections = document.querySelectorAll('section') as NodeListOf<HTMLElement>;
    sections.forEach(section => section.classList.add('d-none'));
    const selectedSection = document.getElementById(`${sectionId}Section`) as HTMLElement | null;
    selectedSection?.classList.remove('d-none'); // Use optional chaining to avoid null errors
}

async function displayCharacters() : Promise<void> {
    const characters: Character[] = await fetchCharacters();
    const container = document.querySelector('.characters-content') as HTMLElement;
    if (!container) return;

    container.innerHTML = '';

    characters.forEach(character => {
        const card : HTMLElement = createCharacterCard(character);
        container.appendChild(card);
    });
}

async function displaySpells() : Promise<void> {
    const spells: Spell[] = await fetchSpells();
    const container = document.querySelector('.spells-content') as HTMLElement;
    if (!container) return;

    container.innerHTML = '';

    spells.forEach(spell => {
        const card : HTMLElement = createSpellCard(spell);
        container.appendChild(card);
    });
}

async function displayPotions() : Promise<void> {
    const potions: Potion[] = await fetchPotions();
    const container = document.querySelector('.potions-content') as HTMLElement;
    if (!container) return;

    container.innerHTML = ''; 

    potions.forEach(potion => {
        const card : HTMLElement = createPotionCard(potion);
        container.appendChild(card);
    });
}

async function fetchCharacters() : Promise<Character[]> {
    try {
        const response: Response = await fetch('https://hp-api.herokuapp.com/api/characters');
        if (!response.ok) {
            throw new Error('Something is wrong with your magic wand!');
        }
        const data: Character[] = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return []; 
    }
}

async function fetchSpells() : Promise<Spell[]> {
    try {
        const response: Response = await fetch('https://hp-api.herokuapp.com/api/spells');
        if (!response.ok) {
            throw new Error('Something is wrong with your spells book!');
        }
        const data: Spell[] = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return []; 
    }
}

async function fetchPotions(): Promise<Potion[]> {
    try {
        const response = await fetch('https://api.potterdb.com/v1/potions');
        if (!response.ok) {
            throw new Error('Something is wrong with your potions data!');
        }
        const data: { data: { attributes: Potion }[] } = await response.json();

        return data.data.map(potion => ({
            name: potion.attributes.name,
            difficulty: potion.attributes.difficulty,
            ingredients: potion.attributes.ingredients || "Not specified",
            effect: potion.attributes.effect,
            image: potion.attributes.image
        }));
    } catch (error) {
        console.error(error);
        return []; 
    }
}

function createCharacterCard(character: Character): HTMLElement {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]') as Character[];
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

    const heartIcon = card.querySelector('.heart-icon') as HTMLElement | null;
    heartIcon?.addEventListener('click', () => toggleFavorite(character));

    return card;
}

function toggleFavorite(character: Character): void {
    const favorites: Character[] = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.findIndex(fav => fav.id === character.id);

    const heartIcon = document.querySelector(`.heart-icon[data-id="${character.id}"]`) as HTMLImageElement | null;

    if (index === -1) {
        favorites.push(character);
        console.log(`Added ${character.name} to favorites`);
        if (heartIcon) {
            heartIcon.src = './heart red.png';
        }
    } else {
        favorites.splice(index, 1);
        console.log(`Removed ${character.name} from favorites`);
        if (heartIcon) {
            heartIcon.src = './heart.png'; 
        }
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));

    updateFavoritesSection();
}

function updateFavoritesSection(): void {
    const favoritesContainer = document.querySelector('.favourites-content') as HTMLElement;
    favoritesContainer.innerHTML = '';

    const favorites: Character[] = JSON.parse(localStorage.getItem('favorites') || '[]');
    console.log('Current favorites:', favorites);
    favorites.forEach(character => {
        const card = createCharacterCard(character);
        favoritesContainer.appendChild(card);
    });
}

document.querySelector('.nav-item[data-id="favourites"]')?.addEventListener('click', () => {
    updateFavoritesSection();
});

function createSpellCard(spell: Spell): HTMLElement {
    const card : HTMLElement= document.createElement('article');
    card.classList.add('spell-card');
    card.innerHTML = `
        <h2>${spell.name}</h2>
        <p>${spell.description}</p>
    `;
    return card;
}

function createPotionCard(potion: Potion): HTMLElement {
    const card : HTMLElement= document.createElement('article');
    card.classList.add('potion-card');
    const potionImage : string = potion.image || './HPpotion.png';
    const potionEffect : string = potion.effect || 'No effect specified';

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

function capitalizeWords(str: string): string {
    str = str.replace(/-/g, ' ');
    str = str.replace(/\b\w/g, match => match.toUpperCase());
    return str;
}

function setupBackToTopButtons(): void {
    const backToTopButtons = document.querySelectorAll('.back-to-top') as NodeListOf<HTMLElement>;

    if (backToTopButtons.length === 0) {
        console.error('Back to Top buttons not found in the DOM');
        return;
    }

    window.addEventListener('scroll', () => {
        backToTopButtons.forEach(button => {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        });
    });
}

function scrollToTop(): void {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0;
}

interface Character {
    id: string,
    name: string,
    alternate_names?: string[],
    species?: string,
    house?: string,
    ancestry?: string,
    wand?: Wand,
    patronus?: string,
    image?: string 
}

interface Wand {
    wood?: string,
    core?: string,
    length?: number
}

interface Spell {
    name: string,
    description: string
}

interface Potion {
    name: string,
    difficulty: string,
    ingredients: string,
    effect: string,
    image?: string,
}