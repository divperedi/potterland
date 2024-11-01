window.addEventListener('load', () => {
    displayGreeting();
})

function displayGreeting(): HTMLElement {
    const greetingRef = document.querySelector('.greeting') as HTMLElement;
    typeEffect(greetingRef, 'I solemnly swear that I am up to no good');
    return greetingRef;
}

function typeEffect(element: HTMLElement, text: string, delay: number = 200) {
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