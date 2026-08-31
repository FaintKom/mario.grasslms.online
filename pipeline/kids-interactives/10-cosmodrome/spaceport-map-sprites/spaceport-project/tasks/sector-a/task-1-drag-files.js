/**
 * ═══════════════════════════════════════════════════════════
 * task-1-drag-files.js - Sector A Task 1
 * Drag and drop files into correct folders
 * ═══════════════════════════════════════════════════════════
 */

class DragFilesTask {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.attempts = 5;
        this.maxAttempts = 5;
        this.completed = false;
        this.userAnswers = {
            'Engines': [],
            'Navigation': [],
            'Communication': []
        };
        
        // Correct answers
        this.correctAnswers = {
            'Engines': ['engine.png', 'fuel.pdf'],
            'Navigation': ['map.docx', 'compass.xlsx'],
            'Communication': ['antenna.jpg', 'radio.mp3']
        };

        // Files data
        this.files = [
            { name: 'engine.png', icon: '🖼️', type: 'image' },
            { name: 'fuel.pdf', icon: '📄', type: 'document' },
            { name: 'map.docx', icon: '📝', type: 'document' },
            { name: 'compass.xlsx', icon: '📊', type: 'spreadsheet' },
            { name: 'antenna.jpg', icon: '🖼️', type: 'image' },
            { name: 'radio.mp3', icon: '🎵', type: 'audio' }
        ];

        // Folders data
        this.folders = [
            { name: 'Engines', icon: '⚙️' },
            { name: 'Navigation', icon: '🧭' },
            { name: 'Communication', icon: '📡' }
        ];
    }

    /**
     * Initialize the task
     */
    init() {
        if (!this.container) {
            console.error('Task container not found');
            return;
        }

        this.render();
        this.setupDragAndDrop();
        this.updateAttemptsDisplay();
    }

    /**
     * Render the task UI
     */
    render() {
        this.container.innerHTML = `
            <div class="task-header">
                <h1 data-i18n="sectors.a.task1.title">Разложи файлы по папкам</h1>
                <p class="task-description" data-i18n="sectors.a.task1.description">
                    Вирус перемешал все файлы! Разложи их по правильным папкам.
                </p>
            </div>

            <div class="attempts-counter">
                <span class="label" data-i18n="common.attempts_left">Осталось попыток:</span>
                <div class="attempts-dots" id="attemptsDots"></div>
            </div>

            <div class="drag-area">
                <!-- Files Pool -->
                <div class="files-pool" id="filesPool">
                    <h3>📁 Файлы</h3>
                    <div class="files-list" id="filesList"></div>
                </div>

                <!-- Folders -->
                <div class="folders-area" id="foldersArea"></div>
            </div>

            <div class="hint-box" id="hintBox">
                <span class="hint-icon">💡</span>
                <p data-i18n="sectors.a.task1.hint"></p>
            </div>

            <div class="task-actions">
                <button class="btn-reset-task" onclick="dragFilesTask.reset()">
                    ↻ <span data-i18n="common.reset">Сброс</span>
                </button>
                <button class="btn-check" onclick="dragFilesTask.check()">
                    ✓ <span data-i18n="common.check">Проверить</span>
                </button>
            </div>
        `;

        this.renderFiles();
        this.renderFolders();
    }

    /**
     * Render draggable files
     */
    renderFiles() {
        const filesList = document.getElementById('filesList');
        if (!filesList) return;

        // Shuffle files
        const shuffledFiles = [...this.files].sort(() => Math.random() - 0.5);

        filesList.innerHTML = shuffledFiles.map(file => `
            <div class="draggable-item" draggable="true" data-file="${file.name}">
                <span class="item-icon">${file.icon}</span>
                <span class="item-name">${file.name}</span>
            </div>
        `).join('');
    }

    /**
     * Render drop zone folders
     */
    renderFolders() {
        const foldersArea = document.getElementById('foldersArea');
        if (!foldersArea) return;

        foldersArea.innerHTML = this.folders.map(folder => `
            <div class="drop-zone" data-folder="${folder.name}">
                <div class="drop-zone-header">
                    <div class="folder-icon">📁</div>
                    <div class="folder-name">${folder.name}</div>
                    <div class="folder-emoji">${folder.icon}</div>
                </div>
                <div class="drop-zone-content"></div>
            </div>
        `).join('');
    }

    /**
     * Setup drag and drop event listeners
     */
    setupDragAndDrop() {
        // Draggable items
        this.container.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('draggable-item')) {
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.dataset.file);
            }
        });

        this.container.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('draggable-item')) {
                e.target.classList.remove('dragging');
            }
        });

        // Drop zones
        this.container.addEventListener('dragover', (e) => {
            if (e.target.closest('.drop-zone')) {
                e.preventDefault();
                e.target.closest('.drop-zone').classList.add('drag-over');
            }
        });

        this.container.addEventListener('dragleave', (e) => {
            if (e.target.closest('.drop-zone')) {
                e.target.closest('.drop-zone').classList.remove('drag-over');
            }
        });

        this.container.addEventListener('drop', (e) => {
            const dropZone = e.target.closest('.drop-zone');
            if (dropZone) {
                e.preventDefault();
                dropZone.classList.remove('drag-over');

                const fileName = e.dataTransfer.getData('text/plain');
                const folderName = dropZone.dataset.folder;

                this.addFileToFolder(fileName, folderName);
            }
        });

        // Remove from folder
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                const droppedItem = e.target.closest('.dropped-item');
                const fileName = droppedItem.dataset.file;
                const folderName = droppedItem.closest('.drop-zone').dataset.folder;
                
                this.removeFileFromFolder(fileName, folderName);
            }
        });
    }

    /**
     * Add file to a folder
     */
    addFileToFolder(fileName, folderName) {
        // Check if file already placed somewhere
        for (const folder in this.userAnswers) {
            const index = this.userAnswers[folder].indexOf(fileName);
            if (index > -1) {
                this.userAnswers[folder].splice(index, 1);
                this.updateFolderContent(folder);
            }
        }

        // Add to new folder
        this.userAnswers[folderName].push(fileName);
        this.updateFolderContent(folderName);

        // Remove from files pool visually
        const fileEl = this.container.querySelector(`[data-file="${fileName}"]`);
        if (fileEl && fileEl.closest('#filesList')) {
            fileEl.style.display = 'none';
        }
    }

    /**
     * Remove file from folder
     */
    removeFileFromFolder(fileName, folderName) {
        const index = this.userAnswers[folderName].indexOf(fileName);
        if (index > -1) {
            this.userAnswers[folderName].splice(index, 1);
            this.updateFolderContent(folderName);

            // Show in files pool again
            const fileEl = this.container.querySelector(`#filesList [data-file="${fileName}"]`);
            if (fileEl) {
                fileEl.style.display = 'flex';
            }
        }
    }

    /**
     * Update folder content display
     */
    updateFolderContent(folderName) {
        const dropZone = this.container.querySelector(`[data-folder="${folderName}"]`);
        if (!dropZone) return;

        const content = dropZone.querySelector('.drop-zone-content');
        const files = this.userAnswers[folderName];

        content.innerHTML = files.map(fileName => {
            const file = this.files.find(f => f.name === fileName);
            return `
                <div class="dropped-item" data-file="${fileName}">
                    <span>${file?.icon || '📄'} ${fileName}</span>
                    <button class="remove-btn">×</button>
                </div>
            `;
        }).join('');
    }

    /**
     * Update attempts display
     */
    updateAttemptsDisplay() {
        const dots = document.getElementById('attemptsDots');
        if (!dots) return;

        dots.innerHTML = Array(this.maxAttempts).fill(0).map((_, i) => 
            `<div class="attempt-dot ${i >= this.attempts ? 'used' : ''}"></div>`
        ).join('');

        // Show hint when 2 attempts left
        if (this.attempts <= 2 && !this.completed) {
            const hintBox = document.getElementById('hintBox');
            if (hintBox) {
                hintBox.classList.add('show');
            }
        }
    }

    /**
     * Check answers
     */
    check() {
        if (this.completed) return;
        if (this.attempts <= 0) return;

        let allCorrect = true;
        const wrongFolders = [];

        for (const folder in this.correctAnswers) {
            const expected = [...this.correctAnswers[folder]].sort();
            const actual = [...(this.userAnswers[folder] || [])].sort();

            const dropZone = this.container.querySelector(`[data-folder="${folder}"]`);

            if (JSON.stringify(expected) === JSON.stringify(actual)) {
                dropZone?.classList.remove('incorrect');
                dropZone?.classList.add('correct');
            } else {
                allCorrect = false;
                wrongFolders.push(folder);
                dropZone?.classList.remove('correct');
                dropZone?.classList.add('incorrect');
                
                // Remove incorrect class after animation
                setTimeout(() => {
                    dropZone?.classList.remove('incorrect');
                }, 500);
            }
        }

        if (allCorrect) {
            this.onSuccess();
        } else {
            this.onFailure(wrongFolders);
        }
    }

    /**
     * Handle success
     */
    onSuccess() {
        this.completed = true;
        
        // Show success message
        alert(window.i18n?.t('common.task_completed') || 'Задание выполнено!');
        
        // Complete task in game state
        if (window.completeTask) {
            window.completeTask('a', 0);
        }
    }

    /**
     * Handle failure
     */
    onFailure(wrongFolders) {
        this.attempts--;
        this.updateAttemptsDisplay();

        if (this.attempts <= 0) {
            alert('Попытки закончились! Попробуйте сбросить задание.');
        } else {
            const folderNames = wrongFolders.join(', ');
            alert(`Проверь папку: ${folderNames}`);
        }
    }

    /**
     * Reset the task
     */
    reset() {
        this.attempts = this.maxAttempts;
        this.completed = false;
        this.userAnswers = {
            'Engines': [],
            'Navigation': [],
            'Communication': []
        };
        
        this.init();
    }
}

// Create instance
let dragFilesTask;

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    dragFilesTask = new DragFilesTask('taskContainer');
    window.dragFilesTask = dragFilesTask;
});

export default DragFilesTask;
