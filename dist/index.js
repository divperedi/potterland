window.addEventListener('load', () => {
    displayGreeting();
});
function displayGreeting() {
    const greetingRef = document.querySelector('.greeting');
    typeEffect(greetingRef, 'I solemnly swear that I am up to no good');
    return greetingRef;
}
function typeEffect(element, text, delay = 200) {
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
