/**
 * ═══════════════════════════════════════════════════════════
 * app.js - Main Application Entry Point
 * Космодром: Атака вируса
 * ═══════════════════════════════════════════════════════════
 */

// Game State
const GameState = {
    studentId: null,
    studentName: null,
    roomId: null,
    sectors: {
        a: { status: 'available', tasks: [false, false, false], code: 'FILES-2312' },
        b: { status: 'locked', tasks: [false, false, false], code: 'GRAPHICS-2312' },
        c: { status: 'locked', tasks: [false, false, false], code: 'DOCUMENT-2312' },
        d: { status: 'locked', tasks: [false, false, false], code: 'PRESENT-2312' }
    },
    readyForLaunch: false,
    completedAt: null
};

// Sector codes for LMS
const SECTOR_CODES = {
    a: 'FILES-2312',
    b: 'GRAPHICS-2312',
    c: 'DOCUMENT-2312',
    d: 'PRESENT-2312'
};

/**
 * Initialize the application
 */
async function initApp() {
    // Load saved progress
    loadProgress();

    // Initialize i18n
    if (window.i18n) {
        await window.i18n.init();
    }

    // Setup event listeners
    setupEventListeners();

    // Update UI based on current state
    updateUI();

    console.log('🚀 Spaceport App initialized');
}

/**
 * Load progress from localStorage
 */
function loadProgress() {
    const saved = localStorage.getItem('spaceport_progress');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(GameState, parsed);
        } catch (e) {
            console.error('Error loading progress:', e);
        }
    }
}

/**
 * Save progress to localStorage
 */
function saveProgress() {
    localStorage.setItem('spaceport_progress', JSON.stringify(GameState));
}

/**
 * Reset all progress
 */
function resetProgress() {
    localStorage.removeItem('spaceport_progress');
    location.reload();
}

/**
 * Setup global event listeners
 */
function setupEventListeners() {
    // Language change
    window.addEventListener('languageChanged', (e) => {
        updateUI();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

/**
 * Update UI based on current state
 */
function updateUI() {
    updateProgressBar();
    updateSectorStates();
    updateLaunchButton();
}

/**
 * Update progress bar
 */
function updateProgressBar() {
    const completed = Object.values(GameState.sectors).filter(s => s.status === 'completed').length;
    const total = Object.keys(GameState.sectors).length;
    const percentage = (completed / total) * 100;

    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    if (progressText) {
        progressText.textContent = `${completed}/${total}`;
    }
}

/**
 * Update sector visual states
 */
function updateSectorStates() {
    Object.entries(GameState.sectors).forEach(([sectorId, sector]) => {
        const sectorEl = document.querySelector(`[data-sector="${sectorId}"]`);
        if (sectorEl) {
            // Remove all state classes
            sectorEl.classList.remove('locked', 'infected', 'in-progress', 'completed');
            
            // Add current state class
            sectorEl.classList.add(sector.status);

            // Update icon
            const icon = sectorEl.querySelector('.sector-icon');
            if (icon) {
                switch (sector.status) {
                    case 'locked':
                        icon.textContent = '🔒';
                        break;
                    case 'infected':
                        icon.textContent = '🔴';
                        break;
                    case 'in-progress':
                        icon.textContent = '⚡';
                        break;
                    case 'completed':
                        icon.textContent = '✅';
                        break;
                }
            }
        }
    });
}

/**
 * Update launch button state
 */
function updateLaunchButton() {
    const launchBtn = document.getElementById('launchBtn');
    if (!launchBtn) return;

    const allCompleted = Object.values(GameState.sectors).every(s => s.status === 'completed');
    launchBtn.disabled = !allCompleted;

    const rocketArea = document.getElementById('rocketArea');
    if (rocketArea) {
        if (allCompleted) {
            rocketArea.classList.add('ready');
        } else {
            rocketArea.classList.remove('ready');
        }
    }
}

/**
 * Open a sector
 */
function openSector(sectorId) {
    const sector = GameState.sectors[sectorId];

    if (sector.status === 'locked') {
        showVirusMessage('locked');
        return;
    }

    // Navigate to sector page or show modal
    showSectorModal(sectorId);
}

/**
 * Complete a task in a sector
 */
function completeTask(sectorId, taskIndex) {
    const sector = GameState.sectors[sectorId];
    sector.tasks[taskIndex] = true;

    // Check if all tasks are completed
    const allTasksCompleted = sector.tasks.every(t => t === true);
    if (allTasksCompleted) {
        sector.status = 'completed';
        showSectorCompletedModal(sectorId);
        showVirusMessage(`sector_${sectorId}_defeated`);
    } else {
        sector.status = 'in-progress';
    }

    saveProgress();
    updateUI();
}

/**
 * Show sector modal
 */
function showSectorModal(sectorId) {
    // This will be implemented in modal.js
    if (window.showSectorModal) {
        window.showSectorModal(sectorId, GameState.sectors[sectorId]);
    }
}

/**
 * Show sector completed modal with code
 */
function showSectorCompletedModal(sectorId) {
    const code = SECTOR_CODES[sectorId];
    // This will be implemented in modal.js
    if (window.showCodeModal) {
        window.showCodeModal(sectorId, code);
    }
}

/**
 * Close all modals
 */
function closeAllModals() {
    document.querySelectorAll('.modal-overlay.show').forEach(modal => {
        modal.classList.remove('show');
    });
}

/**
 * Show virus message
 */
function showVirusMessage(messageType) {
    if (window.showVirusMessage) {
        window.showVirusMessage(messageType);
    }
}

/**
 * Attempt to launch the rocket
 */
function attemptLaunch() {
    const allCompleted = Object.values(GameState.sectors).every(s => s.status === 'completed');

    if (!allCompleted) {
        alert(window.i18n ? window.i18n.t('map.launch_disabled') : 'Complete all sectors first!');
        return;
    }

    // Start launch sequence
    if (window.startLaunchSequence) {
        window.startLaunchSequence();
    }
}

/**
 * Copy code to clipboard
 */
async function copyCode(code) {
    try {
        await navigator.clipboard.writeText(code);
        // Show copied notification
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = window.i18n ? window.i18n.t('common.copied') : 'Copied!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
}

// Export functions for use in HTML
window.GameState = GameState;
window.initApp = initApp;
window.openSector = openSector;
window.completeTask = completeTask;
window.attemptLaunch = attemptLaunch;
window.copyCode = copyCode;
window.resetProgress = resetProgress;
window.saveProgress = saveProgress;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
