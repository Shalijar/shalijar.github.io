document.addEventListener('DOMContentLoaded', (event) => {
    const toggleSwitch = document.querySelector('#checkbox');
    // Check for saved theme in local storage
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.classList.add(currentTheme);
        if (currentTheme === 'dark-mode') {
            toggleSwitch.checked = true;
        }
    }

    // Add listener for the toggle
    toggleSwitch.addEventListener('change', function() {
        if(this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    });
});
