document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    const commandInput = document.getElementById('command-input');
    let commandHistory = JSON.parse(localStorage.getItem('terminalHistory')) || [];
    let historyIndex = -1;
    let currentMission = null;
let loggedIn = localStorage.getItem('terminalLoggedIn') === 'true';
let password = 'admin123'; // Mot de passe à deviner
let difficulty = localStorage.getItem('terminalDifficulty') || 'normal'; // easy, normal, hard
let logbook = JSON.parse(localStorage.getItem('terminalLogbook')) || [];

// Commandes secrètes
const secretCommands = {
    'matrix': () => activateMatrixMode(),
    'godmode': () => enableGodMode(),
    'reveal': () => revealAllPasswords()
};
    
    // Système de missions amélioré avec indices
    let missions = {
        'find-password': {
            description: "Trouve le mot de passe caché dans le système",
            steps: [
                {text: "Recherche de fichiers cachés...", hint: "Essayez la commande 'ls secret/'"},
                {text: "Analyse des fichiers système...", hint: "Le fichier password.txt semble intéressant"},
                {text: "Décryptage en cours...", hint: "Le mot de passe est simple, essayez des combinaisons"},
                {text: `Mot de passe trouvé: '${password}'`, hint: null}
            ],
            completed: false
        },
        'scan-ips': {
            description: "Scan le réseau pour trouver des IPs actives",
            steps: [
                {text: "Lancement du scan réseau...", hint: "Utilisez la commande 'ping 192.168.1.1' pour tester"},
                {text: "Analyse des ports ouverts...", hint: "Le port 22 est souvent utilisé pour SSH"},
                {text: "IPs trouvées: 192.168.1.1, 192.168.1.2, 192.168.1.5", hint: null},
                {text: "Scan terminé avec succès", hint: null}
            ],
            completed: false
        },
        'login': {
            description: "Connectez-vous au système",
            steps: [
                {text: "Identification requise...", hint: "Essayez la commande 'login'"},
                {text: "Mot de passe demandé", hint: "Le mot de passe est dans la mission 'find-password'"},
                {text: "Accès autorisé!", hint: null}
            ],
            completed: false
        }
    };

    // Effet sonore
    function playSound(type) {
        const audio = new Audio();
        audio.src = type === 'success' ? 'success.wav' : 'error.wav';
        audio.volume = 0.3;
        audio.play().catch(e => console.log("Audio error:", e));
    }

    // Vérifier si l'utilisateur est déjà connecté
    if (!loggedIn) {
        addLine("Système verrouillé - Tapez 'login' pour commencer", "system");
    } else {
        addLine("Session restaurée - Bienvenue root", "system");
    }

    // Focus sur l'input au chargement
    commandInput.focus();

    // Gestion de l'historique avec les flèches
    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                commandInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
            }
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            if (historyIndex > 0) {
                historyIndex--;
                commandInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
            } else {
                historyIndex = -1;
                commandInput.value = '';
            }
            e.preventDefault();
        } else if (e.key === 'Enter') {
            executeCommand(commandInput.value);
            commandHistory.push(commandInput.value);
            localStorage.setItem('terminalHistory', JSON.stringify(commandHistory));
            historyIndex = -1;
            commandInput.value = '';
        }
    });

    function addLine(text, type = 'normal') {
        const line = document.createElement('div');
        line.className = type;
        line.textContent = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
        return line;
    }

    function executeCommand(cmd) {
        // Afficher la commande dans le terminal
        const commandLine = addLine(`user@terminal:~$ ${cmd}`, 'command');

        // Enregistrer dans le journal
        logbook.push({
            command: cmd,
            timestamp: new Date().toISOString(),
            user: loggedIn ? 'root' : 'guest'
        });
        localStorage.setItem('terminalLogbook', JSON.stringify(logbook));

        // Traitement de la commande
        const response = processCommand(cmd);
        
        if (response instanceof Promise) {
            response.then(msg => {
                addLine(msg, 'response');
            });
        } else {
            addLine(response, 'response');
        }
    }

    function processCommand(cmd) {
        const args = cmd.trim().split(' ');
        const command = args[0].toLowerCase();
        args.shift();

        switch (command) {
            case 'help':
                return `Available commands:
- help: Show this help message
- ls: List files
- whoami: Show current user
- ping [host]: Ping a server
- connect [host]: Connect to a server
- hack: Start hacking sequence
- login: Connect to system
- mission [name]: Start a mission
- missions: List available missions
- clear: Clear terminal
- exit: Close the terminal`;
            
            case 'ls':
                return `bin/  dev/  etc/  home/  usr/  var/  secret/  mission/`;
            
            case 'whoami':
                return loggedIn ? 'root' : 'guest (not logged in)';
            
            case 'ping':
                return simulatePing(args[0] || 'localhost');
            
            case 'connect':
                return simulateConnection(args[0] || 'localhost');
            
            case 'hack':
                return simulateHacking();
            
            case 'login':
                return handleLogin(args[0]);
            
            case 'mission':
                return startMission(args[0]);
            
            case 'missions':
                return listMissions();
            
            case 'clear':
                output.innerHTML = '';
                return '';
            
            case 'logbook':
                if (!loggedIn) return 'Access denied: login required';
                let logOutput = 'Hacking Logbook:\n';
                logbook.slice().reverse().forEach(entry => {
                    logOutput += `[${new Date(entry.timestamp).toLocaleString()}] ${entry.user}: ${entry.command}\n`;
                });
                return logOutput;
            
            case 'exit':
                return 'Closing terminal...';
            
            case '':
                return '';
            
            default:
                playSound('error');
                return `Command not found: ${command}. Type 'help' for available commands.`;
        }
    }

    function handleLogin(inputPassword) {
        if (loggedIn) return 'Already logged in as root';
        
        if (!inputPassword) {
            return 'Usage: login [password]';
        }

        if (inputPassword === password) {
            loggedIn = true;
            localStorage.setItem('terminalLoggedIn', 'true');
            playSound('success');
            return 'Login successful! Welcome root.';
        } else {
            playSound('error');
            return 'Login failed: incorrect password';
        }
    }

    // Fonctions pour les commandes secrètes
    function activateMatrixMode() {
        const matrixOverlay = document.createElement('div');
        matrixOverlay.id = 'matrix-overlay';
        matrixOverlay.className = 'matrix-rain';
        document.body.appendChild(matrixOverlay);
        
        // Créer l'effet de pluie Matrix
        const chars = "01";
        const cols = Math.floor(window.innerWidth / 20);
        const drops = [];
        
        for (let i = 0; i < cols; i++) {
            drops[i] = 1;
        }

        function draw() {
            const overlay = document.getElementById('matrix-overlay');
            overlay.style.color = '#0f0';
            overlay.style.fontFamily = 'monospace';
            overlay.style.fontSize = '20px';
            
            let output = '';
            for (let i = 0; i < drops.length; i++) {
                output += chars[Math.floor(Math.random() * chars.length)];
                drops[i]++;
                
                if (drops[i] * 20 > window.innerHeight && Math.random() > 0.975) {
                    drops[i] = 0;
                }
            }
            
            overlay.innerHTML = output;
        }
        
        matrixOverlay.style.display = 'block';
        const interval = setInterval(draw, 50);
        
        // Désactiver après 10 secondes
        setTimeout(() => {
            clearInterval(interval);
            matrixOverlay.style.display = 'none';
        }, 10000);
        
        return "Matrix mode activated for 10 seconds!";
    }

    function enableGodMode() {
        password = 'godmode';
        localStorage.setItem('terminalLoggedIn', 'true');
        loggedIn = true;
        return "God mode enabled! All passwords bypassed.";
    }

    function revealAllPasswords() {
        let output = "System passwords revealed:\n";
        output += `- Main password: ${password}\n`;
        output += "- SSH password: root123\n";
        output += "- Database password: dbadmin456";
        return output;
    }

    // ... (rest of the existing functions like simulatePing, simulateConnection, etc.)
});
