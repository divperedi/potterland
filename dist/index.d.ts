declare function displayGreeting(): HTMLElement | null;
declare function typeEffect(element: HTMLElement, text: string, delay?: number): void;
declare function navSetup(): void;
declare function toggleSectionDisplay(sectionId: string): void;
declare function displayCharacters(): Promise<void>;
declare function displaySpells(): Promise<void>;
declare function displayPotions(): Promise<void>;
declare function fetchCharacters(): Promise<Character[]>;
declare function fetchSpells(): Promise<Spell[]>;
declare function fetchPotions(): Promise<Potion[]>;
declare function createCharacterCard(character: Character): HTMLElement;
declare function toggleFavorite(character: Character): void;
declare function updateFavoritesSection(): void;
declare function createSpellCard(spell: Spell): HTMLElement;
declare function createPotionCard(potion: Potion): HTMLElement;
declare function capitalizeWords(str: string): string;
declare function setupBackToTopButtons(): void;
declare function scrollToTop(): void;
interface Character {
    id: string;
    name: string;
    alternate_names?: string[];
    species?: string;
    house?: string;
    ancestry?: string;
    wand?: Wand;
    patronus?: string;
    image?: string;
}
interface Wand {
    wood?: string;
    core?: string;
    length?: number;
}
interface Spell {
    name: string;
    description: string;
}
interface Potion {
    name: string;
    difficulty: string;
    ingredients: string;
    effect: string;
    image?: string;
}
