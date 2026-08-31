/**
 * ═══════════════════════════════════════════════════════════
 * virus.js - Virus Character Module
 * Космодром: Атака вируса
 * ═══════════════════════════════════════════════════════════
 */

class VirusCharacter {
    constructor() {
        this.container = null;
        this.speech = null;
        this.character = null;
        this.currentMessage = null;
        this.messageQueue = [];
        this.isAnimating = false;
    }

    /**
     * Initialize the virus character
     */
    init() {
        this.container = document.getElementById('virusContainer');
        this.speech = document.getElementById('virusSpeech');
        this.character = document.querySelector('.virus-character');

        if (!this.container) {
            console.warn('Virus container not found');
            return;
        }

        // Create particles
        this.createParticles();

        // Show intro message
        this.showMessage('intro');
    }

    /**
     * Create floating particles around the virus
     */
    createParticles() {
        const particlesContainer = document.getElementById('virusParticles');
        if (!particlesContainer) return;

        particlesContainer.innerHTML = '';

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'virus-particle';
            particle.style.left = `${50 + Math.random() * 20 - 10}%`;
            particle.style.top = `${50 + Math.random() * 20 - 10}%`;
            particle.style.setProperty('--tx', `${Math.random() * 60 - 30}px`);
            particle.style.setProperty('--ty', `${Math.random() * 60 - 30}px`);
            particle.style.animationDelay = `${Math.random() * 3}s`;
            particlesContainer.appendChild(particle);
        }
    }

    /**
     * Show a virus message
     */
    showMessage(messageType) {
        if (!this.speech) return;

        // Get translated message
        const message = window.i18n 
            ? window.i18n.t(`virus.${messageType}`)
            : this.getDefaultMessage(messageType);

        // Format message with highlight span
        const formattedMessage = this.formatMessage(message);

        // Update speech bubble
        this.speech.innerHTML = `<p>${formattedMessage}</p>`;

        // Trigger animation
        this.speech.style.animation = 'none';
        this.speech.offsetHeight; // Trigger reflow
        this.speech.style.animation = 'speech-appear 0.5s ease';

        // Play sound effect (if available)
        this.playSound('virus_speak');
    }

    /**
     * Format message to add highlight styling
     */
    formatMessage(message) {
        // Add highlight to exclamations and first words
        return message.replace(/(Ха-ха-ха|Ha-ha-ha|¡Ja-ja-ja|НЕЕЕЕТ|NOOOO|Нет|No|Ааа|Aaa)/g, 
            '<span class="highlight">$1</span>');
    }

    /**
     * Get default message (fallback when i18n not available)
     */
    getDefaultMessage(type) {
        const messages = {
            intro: 'Ха-ха-ха! Я захватил ваш космодром! Попробуйте меня остановить!',
            locked: 'Ха! Этот сектор заблокирован! Сначала освободите другие!',
            sector_a_defeated: 'Нет! Как вы освободили файловый архив?!',
            sector_b_defeated: 'Ааа! Моя графическая станция!',
            sector_c_defeated: 'Не может быть! Вы слишком умные...',
            sector_d_defeated: 'НЕЕЕЕТ! Вы всё испортили!',
            launch: 'НЕЕЕЕТ!'
        };
        return messages[type] || messages.intro;
    }

    /**
     * Play sound effect
     */
    playSound(soundName) {
        // Sound implementation can be added later
        // const audio = new Audio(`./assets/sounds/${soundName}.mp3`);
        // audio.volume = 0.5;
        // audio.play().catch(() => {});
    }

    /**
     * Trigger glitch effect
     */
    glitch() {
        if (!this.character) return;

        this.character.style.animation = 'none';
        this.character.offsetHeight;
        this.character.style.animation = 'virus-glitch 0.5s ease';
    }

    /**
     * Show angry animation
     */
    showAngry() {
        if (!this.character) return;

        this.character.classList.add('angry');
        setTimeout(() => {
            this.character.classList.remove('angry');
        }, 2000);
    }

    /**
     * Defeat animation
     */
    defeat() {
        if (!this.container) return;

        this.showMessage('launch');
        this.container.classList.add('defeated');

        // Play defeat sound
        this.playSound('virus_defeat');
    }

    /**
     * Hide the virus
     */
    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    /**
     * Show the virus
     */
    show() {
        if (this.container) {
            this.container.style.display = 'flex';
        }
    }

    /**
     * React to sector completion
     */
    onSectorDefeated(sectorId) {
        this.glitch();
        setTimeout(() => {
            this.showMessage(`sector_${sectorId}_defeated`);
            this.showAngry();
        }, 300);
    }
}

// Create singleton instance
const virus = new VirusCharacter();

// Export function for global use
window.showVirusMessage = (type) => virus.showMessage(type);
window.virusCharacter = virus;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    virus.init();
});

export default virus;
