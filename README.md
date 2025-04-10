# Terminal Simulator

Un simulateur de terminal interactif en HTML/CSS/JS vanilla avec des fonctionnalités de jeu de hacking.

## Fonctionnalités

### Système de base
- Interface terminal réaliste avec effets visuels (scanlines, glitch, animations)
- Effets sonores pour les actions importantes
- Persistance de l'historique et de l'état de connexion via localStorage

### Commandes interactives :
- `help` : Affiche l'aide
- `ls` : Liste les fichiers
- `whoami` : Affiche l'utilisateur
- `ping [host]` : Effectue un ping
- `connect [host]` : Se connecte à un serveur
- `hack` : Lance une séquence de hacking
- `login [password]` : Système d'authentification
- `missions` : Liste les missions disponibles  
- `mission [name]` : Lance une mission spécifique
- `clear` : Efface le terminal
- `exit` : Quitte le terminal

### Système de missions
- Mission "find-password" : Trouver le mot de passe caché
- Mission "scan-ips" : Scanner le réseau
- Mission "login" : Système d'authentification
- Indices contextuels pour chaque étape
- Progression sauvegardée

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-utilisateur/hacker-terminal-simulator.git
```

2. Ouvrez `index.html` dans un navigateur

## Personnalisation

Pour ajouter des commandes :
1. Modifiez le fichier `script.js`
2. Ajoutez un nouveau cas dans la fonction `processCommand()`

Pour ajouter des missions :
1. Ajoutez un nouvel objet dans le tableau `missions`
2. Définissez les étapes et la description

## Aperçu

![Terminal Screenshot](screenshot.png)

## Licence

MIT
