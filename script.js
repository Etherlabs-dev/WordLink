// Dictionary of prompt words and their associated words
const wordAssociations = {
    'apple': ['fruit', 'red', 'pie', 'orchard', 'cider', 'core', 'juice', 'tree', 'green', 'tart', 'sweet', 'bite', 'crisp', 'eat', 'seed', 'computer'],
    'car': ['drive', 'road', 'vehicle', 'wheel', 'engine', 'tire', 'highway', 'automobile', 'traffic', 'speed', 'gas', 'driver', 'passenger', 'transportation', 'motor', 'sedan', 'race'],
    'book': ['read', 'page', 'story', 'novel', 'author', 'library', 'chapter', 'literature', 'text', 'fiction', 'cover', 'knowledge', 'bookmark', 'magazine', 'paper', 'publish', 'reader'],
    'water': ['drink', 'ocean', 'sea', 'river', 'lake', 'rain', 'liquid', 'swim', 'wet', 'wave', 'blue', 'hydrate', 'thirst', 'bottle', 'flow', 'fish', 'tide'],
    'dog': ['pet', 'animal', 'bark', 'puppy', 'canine', 'tail', 'bone', 'leash', 'walk', 'cat', 'paw', 'fur', 'loyal', 'companion', 'breed', 'fetch', 'friend'],
    'music': ['song', 'sound', 'listen', 'beat', 'rhythm', 'melody', 'instrument', 'band', 'concert', 'tune', 'singer', 'dance', 'radio', 'audio', 'volume', 'piano', 'guitar'],
    'house': ['home', 'building', 'room', 'family', 'roof', 'door', 'window', 'live', 'apartment', 'kitchen', 'bedroom', 'mortgage', 'property', 'yard', 'address', 'residence', 'shelter'],
    'tree': ['leaf', 'branch', 'forest', 'wood', 'plant', 'shade', 'climb', 'trunk', 'root', 'green', 'oak', 'pine', 'garden', 'grow', 'nature', 'tall', 'park'],
    'beach': ['sand', 'ocean', 'sun', 'swim', 'wave', 'shore', 'sea', 'shell', 'vacation', 'summer', 'surf', 'relax', 'coast', 'sunscreen', 'tan', 'towel', 'umbrella'],
    'movie': ['film', 'theater', 'actor', 'watch', 'cinema', 'screen', 'director', 'hollywood', 'scene', 'entertainment', 'star', 'popcorn', 'ticket', 'show', 'actress', 'comedy', 'drama'],
    'food': ['eat', 'meal', 'dinner', 'restaurant', 'cook', 'taste', 'breakfast', 'lunch', 'kitchen', 'hungry', 'delicious', 'recipe', 'dish', 'flavor', 'nutrition', 'ingredient', 'chef'],
    'money': ['cash', 'bank', 'dollar', 'wealth', 'currency', 'spend', 'save', 'coin', 'finance', 'rich', 'pay', 'bill', 'wallet', 'economy', 'invest', 'cost', 'loan'],
    'rain': ['water', 'cloud', 'storm', 'umbrella', 'wet', 'weather', 'pour', 'drizzle', 'puddle', 'thunder', 'lightning', 'droplet', 'shower', 'flood', 'rainbow', 'forecast', 'coat'],
    'game': ['play', 'fun', 'sport', 'win', 'lose', 'rules', 'player', 'competition', 'board', 'card', 'video', 'team', 'score', 'strategy', 'entertain', 'console', 'match'],
    'flower': ['bloom', 'garden', 'petal', 'rose', 'plant', 'beauty', 'smell', 'colorful', 'bouquet', 'daisy', 'spring', 'grow', 'blossom', 'stem', 'vase', 'bud', 'tulip']
};

// Game variables
let currentPrompt = '';
let timer = 30;
let gameActive = false;
let timerInterval;
let score = 0;
let highScore = localStorage.getItem('wordAssociationHighScore') || 0;
let usedWords = [];

// DOM elements
const promptWordEl = document.getElementById('prompt-word');
const wordInputEl = document.getElementById('word-input');
const submitBtnEl = document.getElementById('submit-btn');
const startBtnEl = document.getElementById('start-btn');
const timerEl = document.getElementById('timer');
const timerBarEl = document.getElementById('timer-bar');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const wordHistoryEl = document.getElementById('word-history');
const feedbackEl = document.getElementById('feedback');
const gameOverModalEl = document.getElementById('game-over-modal');
const finalScoreEl = document.getElementById('final-score');
const playAgainBtnEl = document.getElementById('play-again-btn');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');

// Initialize the game
function init() {
    // Display high score
    highScoreEl.textContent = highScore;
    
    // Event listeners
    submitBtnEl.addEventListener('click', submitWord);
    wordInputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitWord();
    });
    startBtnEl.addEventListener('click', startGame);
    playAgainBtnEl.addEventListener('click', () => {
        gameOverModalEl.classList.remove('active');
        startGame();
    });
    
    // Set up difficulty buttons
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            timer = parseInt(btn.dataset.seconds);
            timerEl.textContent = timer;
        });
    });
}

// Start a new game
function startGame() {
    gameActive = true;
    score = 0;
    scoreEl.textContent = score;
    usedWords = [];
    wordHistoryEl.innerHTML = '';
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    
    // Selecting a random prompt
    const promptKeys = Object.keys(wordAssociations);
    currentPrompt = promptKeys[Math.floor(Math.random() * promptKeys.length)];
    promptWordEl.textContent = currentPrompt;
    
    // Reset input field
    wordInputEl.value = '';
    wordInputEl.focus();
    
    // Get selected difficulty
    const activeBtn = document.querySelector('.difficulty-btn.active');
    timer = parseInt(activeBtn.dataset.seconds);
    
    // Reset and start timer
    clearInterval(timerInterval);
    timerEl.textContent = timer;
    timerBarEl.classList.remove('active');
    
    // Need a small delay before adding the class to make sure the animation restarts
    setTimeout(() => {
        timerBarEl.classList.add('active');
        // Adjust animation duration to match the timer
        document.documentElement.style.setProperty('--timer-duration', `${timer}s`);
        timerBarEl.style.animationDuration = `${timer}s`;
        
        timerInterval = setInterval(() => {
            timer--;
            timerEl.textContent = timer;
            
            if (timer <= 0) {
                endGame();
            }
        }, 1000);
    }, 50);
}

// Submit a word for checking
function submitWord() {
    if (!gameActive) return;
    
    const input = wordInputEl.value.trim().toLowerCase();
    
    if (!input) {
        setFeedback('Please enter a word!', 'error');
        return;
    }
    
    // Check if word has already been used
    if (usedWords.includes(input)) {
        setFeedback('You already used that word!', 'error');
        wordInputEl.value = '';
        return;
    }
    
    // Check if the word is valid
    const isValid = checkAssociation(input);
    
    // Add word to history
    addToHistory(input, isValid);
    
    // Update score and feedback
    if (isValid) {
        score += 10;
        scoreEl.textContent = score;
        setFeedback('Good association!', 'success');
        
        // Add a small time bonus for correct answers
        timer += 2;
        timerEl.textContent = timer;
    } else {
        setFeedback('Not a strong association. Try again!', 'error');
    }
    
    // Clear input field
    wordInputEl.value = '';
    wordInputEl.focus();
}

// Check if a word is associated with the current prompt
function checkAssociation(word) {
    // If the word is in our predefined associations, it's valid
    if (wordAssociations[currentPrompt].includes(word)) {
        return true;
    }
    
    // If the word is the same as the prompt, it's invalid
    if (word === currentPrompt) {
        return false;
    }
    
    // Here you could add more sophisticated checking like:
    // 1. Using a third-party API to check word relationships
    // 2. Check if word appears frequently with prompt in common text
    // 3. Use simple stemming to check variations
    
    // For now, we'll just do a simple check:
    // Very short words are less likely to be meaningful associations
    if (word.length < 3) {
        return false;
    }
    
    // Give a small random chance of accepting other words
    // This is a simplified approach; a real game would use better validation
    return Math.random() < 0.3; // 30% chance of accepting other words
}

// Add a word to the history list
function addToHistory(word, isValid) {
    const li = document.createElement('li');
    li.textContent = word;
    li.className = isValid ? 'valid' : 'invalid';
    wordHistoryEl.prepend(li);
    usedWords.push(word);
}

// Set feedback message
function setFeedback(message, type) {
    feedbackEl.textContent = message;
    feedbackEl.className = `feedback ${type}`;
    
    // Clear feedback after 2 seconds
    setTimeout(() => {
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';
    }, 2000);
}

// End the game
function endGame() {
    clearInterval(timerInterval);
    gameActive = false;
    
    // Check for high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('wordAssociationHighScore', highScore);
        highScoreEl.textContent = highScore;
    }
    
    // Show game over modal
    finalScoreEl.textContent = score;
    gameOverModalEl.classList.add('active');
}

// Start game if timer bar animation ends
timerBarEl.addEventListener('animationend', endGame);

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', init);