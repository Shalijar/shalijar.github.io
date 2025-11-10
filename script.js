document.addEventListener('DOMContentLoaded', (event) => {

    /* === FEATURE 1: AUTOMATIC SYSTEM THEME DETECTION === */
    const applyTheme = () => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };
    applyTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);


    /* === FEATURE 2: SCROLL-REVEAL ANIMATIONS === */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
    elementsToReveal.forEach(element => {
        observer.observe(element);
    });

    
    /* === FEATURE 3: DYNAMIC SKILL FILTERING (NEW) === */
    const skillsContainer = document.querySelector('.skills-container');
    const filterableCards = document.querySelectorAll('.card[data-tags]');
    let activeFilters = [];

    // Safety check: Only run this code if the skills container exists
    if (skillsContainer && filterableCards.length > 0) {
        skillsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('skill-tag')) {
                const tag = e.target;
                const filter = tag.textContent.toLowerCase();

                // Toggle the filter in the activeFilters array
                tag.classList.toggle('active');
                if (activeFilters.includes(filter)) {
                    activeFilters = activeFilters.filter(f => f !== filter);
                } else {
                    activeFilters.push(filter);
                }
                
                runFilter();
            }
        });
    }

    function runFilter() {
        filterableCards.forEach(card => {
            const cardTags = card.dataset.tags.split(' ');
            
            // If no filters are active, show all cards
            if (activeFilters.length === 0) {
                card.classList.remove('is-hidden');
                return;
            }

            // Check if every active filter is present in the card's tags
            const matches = activeFilters.every(filter => cardTags.includes(filter));

            if (matches) {
                card.classList.remove('is-hidden');
            } else {
                card.classList.add('is-hidden');
            }
        });
    }


    /* === FEATURE 4: INTERACTIVE TERMINAL (NEW) === */
    const terminal = document.getElementById('terminal');
    
    // Safety check: Only run terminal code if the terminal element exists
    if (terminal) {
        const terminalToggle = document.getElementById('terminal-toggle');
        const terminalOutput = document.getElementById('terminal-output');
        const terminalInput = document.getElementById('terminal-input');
        
        const terminalHistory = [];
        let historyIndex = -1;

        // --- Terminal Toggle ---
        function toggleTerminal(forceOpen = false) {
            if (forceOpen) {
                terminal.classList.add('is-open');
                terminalToggle.classList.add('active');
                terminalInput.focus();
            } else {
                const isOpen = terminal.classList.toggle('is-open');
                terminalToggle.classList.toggle('active', isOpen);
                if (isOpen) {
                    terminalInput.focus();
                }
            }
        }

        terminalToggle.addEventListener('click', () => toggleTerminal());
        
        // Global key listener for Ctrl + `
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === '`') {
                e.preventDefault();
                toggleTerminal();
            }
        });

        // --- Terminal Input Handling ---
        terminalInput.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Enter':
                    const commandText = terminalInput.value.trim();
                    if (commandText) {
                        // Echo command
                        printToTerminal(`> ${commandText}`, 'terminal-command');
                        
                        // Save to history
                        terminalHistory.unshift(commandText);
                        historyIndex = -1; // Reset history index

                        parseCommand(commandText);
                    }
                    terminalInput.value = '';
                    break;
                
                case 'ArrowUp':
                    e.preventDefault();
                    if (historyIndex < terminalHistory.length - 1) {
                        historyIndex++;
                        terminalInput.value = terminalHistory[historyIndex];
                        terminalInput.setSelectionRange(terminalInput.value.length, terminalInput.value.length);
                    }
                    break;

                case 'ArrowDown':
                    e.preventDefault();
                    if (historyIndex > 0) {
                        historyIndex--;
                        terminalInput.value = terminalHistory[historyIndex];
                    } else {
                        historyIndex = -1;
                        terminalInput.value = '';
                    }
                    break;
            }
        });

        // Click on terminal focuses input
        terminal.addEventListener('click', () => {
            terminalInput.focus();
        });

        // --- Command Parser ---
        function parseCommand(command) {
            const parts = command.toLowerCase().split(' ');
            const cmd = parts[0];
            const args = parts.slice(1);

            switch (cmd) {
                case 'help':
                    printToTerminal(
`Available commands:
  help          - Shows this help message
  ls            - Lists portfolio sections
  cat [section] - Shows details about a section (e.g., 'cat experience/cognitive')
  contact       - Displays contact information
  social        - Lists social media links
  skills        - Lists all technical skills
  clear         - Clears the terminal output`
                    );
                    break;
                
                case 'ls':
                    printToTerminal('education/\nexperience/\nprojects/\nskills/');
                    break;
                
                case 'cat':
                    handleCatCommand(args.join(' '));
                    break;
                    
                case 'contact':
                    printToTerminal('ali0shajari@gmail.com');
                    break;

                case 'social':
                    printToTerminal(
`LinkedIn: https://www.linkedin.com/in/ali-shajari
GitHub:   https://github.com/Shalijar`
                    );
                    break;

                case 'skills':
                    const skills = Array.from(document.querySelectorAll('.skill-tag')).map(s => s.textContent).join(', ');
                    printToTerminal(skills);
                    break;

                case 'clear':
                    terminalOutput.innerHTML = '';
                    break;

                default:
                    printToTerminal(`bash: command not found: ${command}`, 'terminal-error');
            }
        }

        function handleCatCommand(path) {
            if (!path) {
                printToTerminal('cat: missing operand', 'terminal-error');
                return;
            }
            
            let content = '';
            switch(path) {
                case 'experience/cognitive':
                    content = 
`[Company] Cognitive Systems
[Role]    Data Science Co-op (May 2025-Present)
[Tasks]
- Programmed microboards using C and MicroPython.
- Developed comprehensive test suites for microboard firmware.`;
                    break;
                case 'experience/dotin':
                    content =
`[Company] Dotin (Core Banking)
[Role]    DevSecOps Intern (Jul 2022-Dec 2022)
[Tasks]
- Implemented high-availability Kubernetes cluster.
- Architected secure Nexus artifact repository.
- Developed Jenkins multibranch pipelines.
- Streamlined GitLab operations and automated with Bash.`;
                    break;
                case 'projects/morrisseau-cleaner':
                    content =
`[Project] Morrisseau Cleaner
[Link]    # (Add link)
[Tasks]
- Developed a Python library for automated data cleaning.
- Implemented robust data validation, improving dataset accuracy.`;
                    break;
                default:
                    content = `cat: ${path}: No such file or directory`;
                    printToTerminal(content, 'terminal-error');
                    return;
            }
            printToTerminal(content);
        }

        // --- Terminal Print Helper ---
        function printToTerminal(text, className = 'terminal-response') {
            const div = document.createElement('div');
            div.textContent = text;
            div.className = className;
            terminalOutput.appendChild(div);
            // Auto-scroll to bottom
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }

        // Focus input on load
        if (terminal.classList.contains('is-open')) {
            terminalInput.focus();
        }
    } // End if(terminal)


    /* === FEATURE 5: CRYPTOGRAPHY PLAYGROUND (NEW) === */
    const cryptoModule = document.getElementById('crypto-playground');
    
    // Safety check: Only run if the crypto module exists
    if (cryptoModule) {
        const input = document.getElementById('crypto-input');
        const output = document.getElementById('crypto-output');
        const slider = document.getElementById('crypto-shift-slider');
        const shiftValue = document.getElementById('crypto-shift-value');
        const modeEncrypt = document.getElementById('crypto-mode-encrypt');
        
        // --- Main Cipher Function ---
        function caesarCipher(text, shift, mode) {
            if (mode === 'decrypt') {
                shift = -shift;
            }

            return text.split('').map(char => {
                const code = char.charCodeAt(0);

                // Uppercase letters (A=65, Z=90)
                if (code >= 65 && code <= 90) {
                    let shiftedCode = ((code - 65 + shift) % 26);
                    if (shiftedCode < 0) shiftedCode += 26; // Handle negative shift
                    return String.fromCharCode(shiftedCode + 65);
                }
                // Lowercase letters (a=97, z=122)
                else if (code >= 97 && code <= 122) {
                    let shiftedCode = ((code - 97 + shift) % 26);
                    if (shiftedCode < 0) shiftedCode += 26; // Handle negative shift
                    return String.fromCharCode(shiftedCode + 97);
                }
                // Other characters (unchanged)
                else {
                    return char;
.                }
            }).join('');
        }

        // --- Update Function ---
        function updateCrypto() {
            // Ensure elements exist before using them
            if (!input || !output || !slider || !shiftValue || !modeEncrypt) return;

            const text = input.value;
            const shift = parseInt(slider.value, 10);
            const mode = modeEncrypt.checked ? 'encrypt' : 'decrypt';
            
            // Update labels
            shiftValue.textContent = shift;
            if (mode === 'encrypt') {
                input.previousElementSibling.textContent = 'Input (Plaintext)';
                output.previousElementSibling.textContent = 'Output (Ciphertext)';
            } else {
                input.previousElementSibling.textContent = 'Input (Ciphertext)';
                output.previousElementSibling.textContent = 'Output (Plaintext)';
            }

            // Run cipher
            output.value = caesarCipher(text, shift, mode);
        }

        // --- Event Listeners ---
        // Add safety checks for all listeners
        input?.addEventListener('input', updateCrypto);
        slider?.addEventListener('input', updateCrypto);
        
        const cryptoModeContainer = cryptoModule.querySelector('.crypto-mode');
        cryptoModeContainer?.addEventListener('change', updateCrypto);

        // Initial run
        updateCrypto();
    } // End if(cryptoModule)

});
