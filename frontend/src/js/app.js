// This file contains the UI logic and handles screen switching between different views in the SPA. 
// It interacts with the API functions defined in api.js.

document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const navigationLinks = document.querySelectorAll('.nav-link');

    function hideAllScreens() {
        screens.forEach(screen => {
            screen.classList.add('hidden');
        });
    }

    function showScreen(screenId) {
        hideAllScreens();
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.remove('hidden');
        }
    }

    navigationLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetScreen = event.target.getAttribute('data-target');
            showScreen(targetScreen);
        });
    });

    // Initialize the app by showing the default screen
    showScreen('homeScreen');
});