/**
 * ═══════════════════════════════════════════════════════════
 * modal.js - Modal Component
 * Reusable modal dialogs
 * ═══════════════════════════════════════════════════════════
 */

class Modal {
    constructor() {
        this.activeModal = null;
    }

    /**
     * Show sector info modal
     */
    showSectorModal(sectorId, sectorState) {
        const sectorData = this.getSectorData(sectorId);
        
        const modal = document.getElementById('sectorModal');
        if (!modal) return;

        // Update modal content
        document.getElementById('modalIcon').textContent = sectorData.icon;
        document.getElementById('modalTitle').textContent = 
            window.i18n?.t(`sectors.${sectorId}.name`) + ': ' + 
            window.i18n?.t(`sectors.${sectorId}.title`);
        document.getElementById('modalDescription').textContent = 
            window.i18n?.t(`sectors.${sectorId}.description`);

        // Update task list
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = sectorData.tasks.map((task, index) => {
            const isDone = sectorState.tasks[index];
            return `
                <li>
                    <span class="task-icon">${index + 1}️⃣</span>
                    <span class="task-name">${window.i18n?.t(`sectors.${sectorId}.task${index + 1}.title`) || task}</span>
                    <span class="task-status ${isDone ? 'done' : 'pending'}">
                        ${isDone ? '✓ ' + (window.i18n?.t('status.completed') || 'Выполнено') : '○ ' + (window.i18n?.t('status.in_progress') || 'В процессе')}
                    </span>
                </li>
            `;
        }).join('');

        // Update action button
        const actionBtn = document.getElementById('modalActionBtn');
        if (sectorState.status === 'completed') {
            actionBtn.textContent = window.i18n?.t('common.review') || 'Пересмотреть';
            actionBtn.onclick = () => this.navigateToSector(sectorId);
        } else {
            actionBtn.textContent = window.i18n?.t('common.start') || 'Начать';
            actionBtn.onclick = () => this.navigateToSector(sectorId);
        }

        modal.classList.add('show');
        this.activeModal = modal;
    }

    /**
     * Show code reveal modal
     */
    showCodeModal(sectorId, code) {
        const html = `
            <div class="modal-overlay show" id="codeModal">
                <div class="modal success">
                    <div class="modal-header">
                        <span class="icon">🎉</span>
                        <h2>${window.i18n?.t('common.all_tasks_done') || 'Все задания выполнены!'}</h2>
                    </div>
                    <div class="modal-content">
                        <p>${window.i18n?.t(`sectors.${sectorId}.title`)} освобождён!</p>
                        <div class="code-reveal">
                            <div class="code-label">Твой код для LMS:</div>
                            <div class="code-value">${code}</div>
                            <button class="btn-copy" onclick="copyCode('${code}')">
                                📋 ${window.i18n?.t('common.copy') || 'Скопировать'}
                            </button>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-modal primary" onclick="modal.closeCodeModal()">
                            ${window.i18n?.t('common.close') || 'Закрыть'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        this.activeModal = document.getElementById('codeModal');
    }

    /**
     * Close code modal
     */
    closeCodeModal() {
        const codeModal = document.getElementById('codeModal');
        if (codeModal) {
            codeModal.remove();
        }
        this.activeModal = null;
    }

    /**
     * Close current modal
     */
    close() {
        if (this.activeModal) {
            this.activeModal.classList.remove('show');
            this.activeModal = null;
        }
    }

    /**
     * Navigate to sector page
     */
    navigateToSector(sectorId) {
        this.close();
        window.location.href = `./tasks/sector-${sectorId}/index.html`;
    }

    /**
     * Get sector data
     */
    getSectorData(sectorId) {
        const sectors = {
            a: {
                icon: '📁',
                tasks: ['Разложи файлы по папкам', 'Найди файл по пути', 'Исправь структуру папок']
            },
            b: {
                icon: '🎨',
                tasks: ['Почини плату (простая)', 'Почини плату (сложная)', 'Соедини инструменты']
            },
            c: {
                icon: '📄',
                tasks: ['Исправь ошибки в тексте', 'Отформатируй текст', 'Вставь пропущенные слова']
            },
            d: {
                icon: '📊',
                tasks: ['Расставь слайды', 'Добавь заголовки', 'Исправь ошибки дизайна']
            }
        };
        return sectors[sectorId] || sectors.a;
    }
}

// Create singleton
const modal = new Modal();

// Export for global use
window.modal = modal;
window.showSectorModal = (sectorId, state) => modal.showSectorModal(sectorId, state);
window.showCodeModal = (sectorId, code) => modal.showCodeModal(sectorId, code);
window.closeModal = () => modal.close();

export default modal;
