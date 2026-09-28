/**
 * Space Virus Quest - Main JavaScript
 * Common functions and utilities
 */

// ============================================
// MODAL FUNCTIONS
// ============================================

function showModal(text, character = 'robot', buttons = null) {
    const overlay = document.getElementById('modal-overlay');
    const textEl = document.getElementById('modal-text');
    const characterEl = document.getElementById('modal-character');
    const buttonsEl = document.getElementById('modal-buttons');
    
    textEl.textContent = text;
    
    // Set character SVG
    if (character === 'robot') {
        characterEl.innerHTML = document.getElementById('robot-svg-container').innerHTML;
        characterEl.querySelector('.robot-svg')?.classList.add('idle');
    } else if (character === 'virus') {
        characterEl.innerHTML = document.getElementById('virus-svg-container').innerHTML;
        characterEl.querySelector('.virus-svg')?.classList.add('idle');
    }
    
    // Set buttons
    if (buttons) {
        buttonsEl.innerHTML = buttons.map(btn => 
            `<button class="btn ${btn.class || 'btn-primary'}" onclick="${btn.onclick}">${btn.text}</button>`
        ).join('');
    } else {
        buttonsEl.innerHTML = '<button class="btn btn-primary" onclick="closeModal()">Закрыть</button>';
    }
    
    overlay.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

// ============================================
// CODE MODAL FUNCTIONS
// ============================================

function showCodeModal(code) {
    const modal = document.getElementById('code-modal');
    const codeValue = document.getElementById('code-value');
    const robotContainer = modal.querySelector('.code-modal-robot');
    
    codeValue.textContent = code;
    
    // Add robot SVG
    robotContainer.innerHTML = document.getElementById('robot-svg-container').innerHTML;
    const robotSvg = robotContainer.querySelector('.robot-svg');
    if (robotSvg) {
        robotSvg.classList.add('happy');
    }
    
    modal.classList.remove('hidden');
    
    // Celebration effect
    createConfetti();
}

function closeCodeModal() {
    document.getElementById('code-modal').classList.add('hidden');
}

function copyCode() {
    const code = document.getElementById('code-value').textContent;
    navigator.clipboard.writeText(code).then(() => {
        showToast('Код скопирован!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Код скопирован!', 'success');
    });
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Remove after animation
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ============================================
// CONFETTI EFFECT
// ============================================

function createConfetti() {
    const colors = ['#fde047', '#facc15', '#3b82f6', '#22c55e', '#ef4444', '#a855f7'];
    const container = document.body;
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}vw;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            z-index: 2000;
            pointer-events: none;
            animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
        `;
        container.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
    }
}

// Add confetti animation to CSS dynamically
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// ============================================
// API FUNCTIONS
// ============================================

async function checkTask(taskId, answer) {
    try {
        const response = await fetch('/api/check-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task_id: taskId, answer: answer })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error checking task:', error);
        return { success: false, message: 'Ошибка при проверке. Попробуй ещё раз.' };
    }
}

async function requestExtraAttempts(taskId, confirmed = false) {
    try {
        const response = await fetch('/api/request-extra-attempts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task_id: taskId, confirmed: confirmed })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error requesting extra attempts:', error);
        return { success: false, message: 'Ошибка. Попробуй ещё раз.' };
    }
}

// ============================================
// ATTEMPTS DISPLAY
// ============================================

function updateAttemptsDisplay(attempts) {
    const dots = document.querySelectorAll('.attempt-dot');
    dots.forEach((dot, index) => {
        if (index < attempts) {
            dot.classList.remove('used');
        } else {
            dot.classList.add('used');
        }
    });
}

// ============================================
// HINT DISPLAY
// ============================================

function showHint() {
    const hintBox = document.querySelector('.hint-box');
    if (hintBox) {
        hintBox.classList.add('visible');
    }
}

// ============================================
// EXTRA ATTEMPTS DIALOG
// ============================================

function askForExtraAttempts(taskId) {
    showModal(
        'Попытки закончились! Попросить робота дать ещё 5 попыток?',
        'robot',
        [
            {
                text: 'Да, попросить',
                class: 'btn-primary',
                onclick: `confirmExtraAttempts('${taskId}')`
            },
            {
                text: 'Нет, спасибо',
                class: 'btn-secondary',
                onclick: 'closeModal()'
            }
        ]
    );
}

async function confirmExtraAttempts(taskId) {
    closeModal();
    
    // First call without confirmation to trigger confirmation message
    const firstResponse = await requestExtraAttempts(taskId, false);
    
    if (firstResponse.need_confirmation) {
        showModal(
            firstResponse.message,
            'robot',
            [
                {
                    text: 'Да, уверен!',
                    class: 'btn-primary',
                    onclick: `grantExtraAttempts('${taskId}')`
                },
                {
                    text: 'Отмена',
                    class: 'btn-secondary',
                    onclick: 'closeModal()'
                }
            ]
        );
    }
}

async function grantExtraAttempts(taskId) {
    closeModal();
    
    const response = await requestExtraAttempts(taskId, true);
    
    if (response.success) {
        updateAttemptsDisplay(response.attempts);
        showToast(response.message, 'success');
    } else {
        showToast(response.message, 'error');
    }
}

// ============================================
// DRAG & DROP UTILITIES
// ============================================

function initDragAndDrop(draggableSelector, dropzoneSelector, onDrop) {
    const draggables = document.querySelectorAll(draggableSelector);
    const dropzones = document.querySelectorAll(dropzoneSelector);
    
    draggables.forEach(draggable => {
        draggable.setAttribute('draggable', true);
        
        draggable.addEventListener('dragstart', (e) => {
            draggable.classList.add('dragging');
            e.dataTransfer.setData('text/plain', draggable.dataset.id || draggable.id);
            e.dataTransfer.effectAllowed = 'move';
        });
        
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });
    
    dropzones.forEach(dropzone => {
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            dropzone.classList.add('drag-over');
        });
        
        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('drag-over');
        });
        
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('drag-over');
            
            const itemId = e.dataTransfer.getData('text/plain');
            const item = document.querySelector(`[data-id="${itemId}"]`) || document.getElementById(itemId);
            
            if (item && onDrop) {
                onDrop(item, dropzone);
            }
        });
    });
}

// ============================================
// SOUND EFFECTS (Optional)
// ============================================

const sounds = {
    success: null,
    error: null,
    click: null
};

function playSound(soundName) {
    // Sounds can be loaded and played here
    // For now, this is a placeholder
    console.log(`Playing sound: ${soundName}`);
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Space Virus Quest loaded!');
    
    // Close modal on overlay click
    document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') {
            closeModal();
        }
    });
    
    document.getElementById('code-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'code-modal') {
            closeCodeModal();
        }
    });
    
    // Escape key closes modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeCodeModal();
        }
    });
});
