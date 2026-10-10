// Facility Escape Room Puzzle Engine

class EscapeGame {
    constructor() {
        this.currentRoom = 1;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('facility_escape_highscore') || '0', 10);
        this.attemptsLeft = 6;
        this.currentWordObj = null;
        this.currentWord = "";
        this.guessedConsonants = new Set();
        this.usedWords = new Set();
        
        this.stats = {
            roomsCleared: 0,
            consonantsGuessed: 0,
            hintsUsed: 0
        };

        this.vowels = new Set(['A', 'E', 'I', 'O', 'U']);
        this.isGameOver = false;
        this.isRoomCleared = false;
        this.gasCanvas = null;
        this.gasCtx = null;
        this.particles = [];
        this.animFrameId = null;
    }

    init() {
        this.bindEvents();
        this.initGasCanvas();
        this.updateScoreUI();
        
        // Render initial keyboard layout
        this.renderKeyboard();

        // Start particle animation loop
        this.animateGasParticles();
    }

    bindEvents() {
        // Physical Keyboard Input
        document.addEventListener('keydown', (e) => {
            if (this.isGameOver || this.isRoomCleared) return;
            const key = e.key.toUpperCase();
            if (key.length === 1 && key >= 'A' && key <= 'Z') {
                this.handleKeyInput(key);
            }
        });

        // Intro Modal Start Button
        document.getElementById('startBtn').addEventListener('click', () => {
            audio.startAmbient();
            this.hideModal('introModal');
            this.startNewRun();
        });

        // Stage Clear Proceed Button
        document.getElementById('nextRoomBtn').addEventListener('click', () => {
            audio.playKeyClick();
            this.hideModal('stageClearModal');
            this.proceedToNextRoom();
        });

        // Game Over Restart Button
        document.getElementById('restartBtn').addEventListener('click', () => {
            audio.playKeyClick();
            this.hideModal('gameOverModal');
            this.deactivateGasEffect();
            this.startNewRun();
        });

        // Override / Hint Button
        document.getElementById('hintBtn').addEventListener('click', () => {
            this.useHint();
        });

        // Audio Mute Buttons
        document.getElementById('muteAudioBtn').addEventListener('click', () => {
            const isMuted = audio.toggleMute();
            document.getElementById('muteAudioBtn').innerHTML = isMuted ? 
                `<span>🔇</span> SFX: OFF` : `<span>🔊</span> SFX: ON`;
        });

        document.getElementById('ambientBtn').addEventListener('click', () => {
            const isAmbientOn = audio.toggleAmbient();
            document.getElementById('ambientBtn').innerHTML = isAmbientOn ? 
                `<span>🎵</span> AMBIENT: ON` : `<span>🔇</span> AMBIENT: OFF`;
        });

        // CRT Screen Flicker Toggle
        document.getElementById('flickerBtn').addEventListener('click', () => {
            const viewport = document.querySelector('.game-viewport');
            viewport.classList.toggle('light-flicker');
            audio.playKeyClick();
        });

        // Lore Clue Modal / Clue Reveal
        document.getElementById('clueBtn').addEventListener('click', () => {
            audio.playKeyClick();
            if (this.currentWordObj) {
                const loreText = `[LOG #${100 + this.currentRoom}] Category: ${this.currentWordObj.category} // Clue: ${this.currentWordObj.hint}`;
                document.getElementById('loreText').innerText = loreText;
            }
        });
    }

    startNewRun() {
        this.currentRoom = 1;
        this.score = 0;
        this.usedWords.clear();
        this.stats = { roomsCleared: 0, consonantsGuessed: 0, hintsUsed: 0 };
        this.isGameOver = false;
        this.isRoomCleared = false;
        this.updateScoreUI();
        this.loadRoomPuzzle();
    }

    proceedToNextRoom() {
        this.currentRoom++;
        this.isRoomCleared = false;
        this.loadRoomPuzzle();
    }

    loadRoomPuzzle() {
        this.currentWordObj = getWordForRoom(this.currentRoom, this.usedWords);
        this.currentWord = this.currentWordObj.word.toUpperCase();
        this.usedWords.add(this.currentWord);

        this.attemptsLeft = 6;
        this.guessedConsonants.clear();
        this.isGameOver = false;
        this.isRoomCleared = false;

        // Automatically reveal vowels
        // (Vowels are already in this.vowels set, so we don't need to guess them)

        // Reset Security Log Clue Banner
        document.getElementById('loreText').innerText = `[LOG #${100 + this.currentRoom}] Facility Door Locked. Decipher terminal cipher code.`;

        // Update UI Elements
        this.updateHeaderUI();
        this.renderWordSlots();
        this.renderHazardLamps();
        this.renderKeyboard();
        this.updateHintBtnState();
    }

    updateHeaderUI() {
        document.getElementById('roomBadge').innerText = `ROOM ${String(this.currentRoom).padStart(2, '0')}`;
        
        const secStatusEl = document.getElementById('securityStatus');
        secStatusEl.className = 'security-status';
        if (this.attemptsLeft >= 5) {
            secStatusEl.innerText = '● SECURE';
        } else if (this.attemptsLeft >= 3) {
            secStatusEl.innerText = '▲ ELEVATED RISK';
            secStatusEl.classList.add('elevated');
        } else if (this.attemptsLeft >= 2) {
            secStatusEl.innerText = '⚠️ CRITICAL ALERT';
            secStatusEl.classList.add('critical');
        } else {
            secStatusEl.innerText = '☣ LETHAL PURGE IMMINENT';
            secStatusEl.classList.add('lethal');
        }

        this.updateScoreUI();
    }

    updateScoreUI() {
        document.getElementById('liveScore').innerText = this.score;
        document.getElementById('highScoreVal').innerText = this.highScore;
        this.updateHintBtnState();
    }

    renderWordSlots() {
        const container = document.getElementById('wordDisplay');
        container.innerHTML = '';

        for (let i = 0; i < this.currentWord.length; i++) {
            const letter = this.currentWord[i];
            const slot = document.createElement('div');
            slot.className = 'letter-slot';

            if (this.vowels.has(letter)) {
                // Initial Reveal: All vowels are automatically revealed
                slot.classList.add('revealed-vowel');
                slot.innerText = letter;
            } else if (this.guessedConsonants.has(letter)) {
                // Correctly guessed consonant
                slot.classList.add('revealed-consonant');
                slot.innerText = letter;
            } else {
                // Blank consonant slot
                slot.classList.add('blank');
                slot.innerText = '';
            }

            container.appendChild(slot);
        }
    }

    renderHazardLamps() {
        const container = document.getElementById('lampsContainer');
        container.innerHTML = '';
        
        // 6 incorrect attempt lamps
        for (let i = 1; i <= 6; i++) {
            const lamp = document.createElement('div');
            lamp.className = 'hazard-lamp';
            lamp.innerText = i;
            
            // If attempt was lost (e.g. 6 - attemptsLeft >= i)
            if (6 - this.attemptsLeft >= i) {
                lamp.classList.add('failed');
            }
            container.appendChild(lamp);
        }

        document.getElementById('attemptsCountText').innerText = `${this.attemptsLeft} / 6`;
    }

    renderKeyboard() {
        const rows = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
        ];

        const container = document.getElementById('keypadWrapper');
        container.innerHTML = '';

        rows.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';

            row.forEach(letter => {
                const btn = document.createElement('button');
                btn.className = 'key-btn';
                btn.innerText = letter;
                btn.setAttribute('data-key', letter);

                if (this.vowels.has(letter)) {
                    btn.classList.add('vowel-key');
                    btn.disabled = true;
                } else if (this.guessedConsonants.has(letter)) {
                    if (this.currentWord.includes(letter)) {
                        btn.classList.add('correct');
                    } else {
                        btn.classList.add('wrong');
                    }
                    btn.disabled = true;
                } else {
                    btn.addEventListener('click', () => {
                        this.handleKeyInput(letter);
                    });
                }

                rowDiv.appendChild(btn);
            });

            container.appendChild(rowDiv);
        });
    }

    handleKeyInput(letter) {
        if (this.isGameOver || this.isRoomCleared) return;

        // Vowels are automatically revealed at start
        if (this.vowels.has(letter)) {
            audio.playKeyClick();
            return;
        }

        // Ignore already guessed consonant
        if (this.guessedConsonants.has(letter)) {
            return;
        }

        this.guessedConsonants.add(letter);

        if (this.currentWord.includes(letter)) {
            // Correct Consonant Guess!
            this.stats.consonantsGuessed++;
            
            // Count instances of this consonant in the word
            let count = 0;
            for (let i = 0; i < this.currentWord.length; i++) {
                if (this.currentWord[i] === letter) count++;
            }
            
            // +10 Points per correct consonant revealed
            this.score += 10 * count;
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('facility_escape_highscore', this.highScore.toString());
            }

            audio.playCorrect();
            this.renderWordSlots();
            this.renderKeyboard();
            this.updateScoreUI();

            // Check Win Condition
            if (this.checkWordComplete()) {
                this.handleRoomClear();
            }
        } else {
            // Incorrect Consonant Guess
            this.attemptsLeft--;
            audio.playWrong();
            this.updateHeaderUI();
            this.renderHazardLamps();
            this.renderKeyboard();

            if (this.attemptsLeft <= 0) {
                this.handleGameOver();
            }
        }
    }

    useHint() {
        if (this.score < 10 || this.isGameOver || this.isRoomCleared) return;

        // Find all unrevealed consonants in current word
        const unrevealedConsonants = [];
        for (let i = 0; i < this.currentWord.length; i++) {
            const letter = this.currentWord[i];
            if (!this.vowels.has(letter) && !this.guessedConsonants.has(letter)) {
                unrevealedConsonants.push(letter);
            }
        }

        if (unrevealedConsonants.length === 0) return;

        // Pick a random unrevealed consonant
        const randomIndex = Math.floor(Math.random() * unrevealedConsonants.length);
        const hintLetter = unrevealedConsonants[randomIndex];

        // Deduct 10 points
        this.score -= 10;
        this.stats.hintsUsed++;
        audio.playHint();

        // Reveal the consonant letter (same as guessing it)
        this.guessedConsonants.add(hintLetter);

        // Count instances of hint letter
        let count = 0;
        for (let i = 0; i < this.currentWord.length; i++) {
            if (this.currentWord[i] === hintLetter) count++;
        }

        // Note: The prompt states: "An 'Override / Hint' button fills in one random blank slot for -10 points (disabled if score is 0)."
        // Score was deducted by 10 points for buying the hint.

        this.updateScoreUI();
        this.renderWordSlots();
        this.renderKeyboard();

        if (this.checkWordComplete()) {
            this.handleRoomClear();
        }
    }

    updateHintBtnState() {
        const hintBtn = document.getElementById('hintBtn');
        if (!hintBtn) return;

        let hasUnrevealed = false;
        if (this.currentWord) {
            for (let i = 0; i < this.currentWord.length; i++) {
                const ch = this.currentWord[i];
                if (!this.vowels.has(ch) && !this.guessedConsonants.has(ch)) {
                    hasUnrevealed = true;
                    break;
                }
            }
        }

        if (this.score < 10 || !hasUnrevealed || this.isGameOver || this.isRoomCleared) {
            hintBtn.disabled = true;
        } else {
            hintBtn.disabled = false;
        }
    }

    checkWordComplete() {
        for (let i = 0; i < this.currentWord.length; i++) {
            const ch = this.currentWord[i];
            if (!this.vowels.has(ch) && !this.guessedConsonants.has(ch)) {
                return false;
            }
        }
        return true;
    }

    handleRoomClear() {
        this.isRoomCleared = true;
        this.stats.roomsCleared++;
        audio.playDoorUnlock();

        // Room clear bonus
        const roomBonus = 25;
        this.score += roomBonus;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('facility_escape_highscore', this.highScore.toString());
        }
        this.updateScoreUI();

        // Door split animation trigger
        const doorOverlay = document.getElementById('doorOverlay');
        doorOverlay.classList.add('closing');

        setTimeout(() => {
            doorOverlay.classList.remove('closing');
            
            // Populate Stage Clear Modal
            document.getElementById('clearedWordVal').innerText = this.currentWord;
            document.getElementById('clearedRoomVal').innerText = `ROOM ${String(this.currentRoom).padStart(2, '0')}`;
            document.getElementById('totalScoreVal').innerText = this.score;
            
            this.showModal('stageClearModal');
        }, 750);
    }

    handleGameOver() {
        this.isGameOver = true;
        audio.playGameOver();
        this.activateGasEffect();

        // Populate Game Over Modal
        document.getElementById('revealedWordOnLoss').innerText = this.currentWord;
        document.getElementById('finalScoreVal').innerText = this.score;
        document.getElementById('roomsSurvivedVal').innerText = this.stats.roomsCleared;
        document.getElementById('consonantsGuessedVal').innerText = this.stats.consonantsGuessed;

        setTimeout(() => {
            this.showModal('gameOverModal');
        }, 1200);
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    // Canvas Particle System for Toxic Poison Gas & Ambient Dust
    initGasCanvas() {
        this.gasCanvas = document.getElementById('gasCanvas');
        if (!this.gasCanvas) return;
        this.gasCtx = this.gasCanvas.getContext('2d');
        this.resizeGasCanvas();

        window.addEventListener('resize', () => this.resizeGasCanvas());

        // Create initial particles
        for (let i = 0; i < 60; i++) {
            this.particles.push({
                x: Math.random() * this.gasCanvas.width,
                y: Math.random() * this.gasCanvas.height,
                radius: Math.random() * 60 + 20,
                vx: Math.random() * 1.5 - 0.75,
                vy: -Math.random() * 1.2 - 0.5,
                alpha: Math.random() * 0.4 + 0.1
            });
        }
    }

    resizeGasCanvas() {
        if (this.gasCanvas) {
            this.gasCanvas.width = window.innerWidth;
            this.gasCanvas.height = window.innerHeight;
        }
    }

    activateGasEffect() {
        if (this.gasCanvas) this.gasCanvas.classList.add('active');
        const alarm = document.getElementById('alarmOverlay');
        if (alarm) alarm.classList.add('active');
    }

    deactivateGasEffect() {
        if (this.gasCanvas) this.gasCanvas.classList.remove('active');
        const alarm = document.getElementById('alarmOverlay');
        if (alarm) alarm.classList.remove('active');
    }

    animateGasParticles() {
        if (!this.gasCtx) return;

        this.gasCtx.clearRect(0, 0, this.gasCanvas.width, this.gasCanvas.height);

        if (this.isGameOver) {
            // Draw toxic green fog clouds
            this.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.y + p.radius < 0) {
                    p.y = this.gasCanvas.height + p.radius;
                    p.x = Math.random() * this.gasCanvas.width;
                }

                const grad = this.gasCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
                grad.addColorStop(0, `rgba(0, 255, 102, ${p.alpha * 0.5})`);
                grad.addColorStop(0.6, `rgba(20, 100, 40, ${p.alpha * 0.25})`);
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

                this.gasCtx.fillStyle = grad;
                this.gasCtx.beginPath();
                this.gasCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.gasCtx.fill();
            });
        }

        requestAnimationFrame(() => this.animateGasParticles());
    }
}

// Global Game Engine Instance
let gameEngine = null;
window.addEventListener('DOMContentLoaded', () => {
    gameEngine = new EscapeGame();
    gameEngine.init();
});
