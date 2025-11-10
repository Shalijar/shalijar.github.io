document.addEventListener('DOMContentLoaded', (event) => {

    /* === FEATURE 1: AUTOMATIC SYSTEM THEME DETECTION === */
    
    // This function checks the system preference and applies the dark-mode class
    const applyTheme = () => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // User's system is in dark mode
            document.body.classList.add('dark-mode');
        } else {
            // User's system is in light mode
            document.body.classList.remove('dark-mode');
        }
    };

    // Apply the theme immediately on load
    applyTheme();

    // Add a listener to watch for *live* changes in system preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);


    /* === FEATURE 2: SCROLL-REVEAL ANIMATIONS === */

    // Set up the Intersection Observer
    // This is the modern, efficient way to detect when an element enters the viewport
    const observer = new IntersectionObserver((entries) => {
        // Loop over all the elements being observed
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If the element is in view, add the 'is-visible' class
                entry.target.classList.add('is-visible');
                // We only want this to animate once, so we unobserve it
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Find all elements with the 'reveal-on-scroll' class
    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
    
    // Tell the observer to watch each of these elements
    elementsToReveal.forEach(element => {
        observer.observe(element);
    });

});
