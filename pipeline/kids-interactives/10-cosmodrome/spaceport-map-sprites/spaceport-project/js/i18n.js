/**
 * ═══════════════════════════════════════════════════════════
 * i18n.js - Internationalization Module
 * Космодром: Атака вируса
 * ═══════════════════════════════════════════════════════════
 */

class I18n {
    constructor() {
        this.currentLang = 'ru';
        this.translations = {};
        this.supportedLanguages = ['ru', 'en', 'es', 'id'];
        this.loadedLanguages = new Set();
    }

    /**
     * Initialize i18n with default language
     */
    async init(defaultLang = 'ru') {
        // Try to get saved language preference
        const savedLang = localStorage.getItem('spaceport_language');
        this.currentLang = savedLang || defaultLang;

        // Load the default language
        await this.loadLanguage(this.currentLang);
        
        // Update all elements with data-i18n attribute
        this.updateAllElements();

        return this;
    }

    /**
     * Load a language file
     */
    async loadLanguage(lang) {
        if (this.loadedLanguages.has(lang)) {
            return this.translations[lang];
        }

        try {
            const response = await fetch(`./locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${lang}.json`);
            }
            this.translations[lang] = await response.json();
            this.loadedLanguages.add(lang);
            return this.translations[lang];
        } catch (error) {
            console.error(`Error loading language ${lang}:`, error);
            // Fallback to Russian if available
            if (lang !== 'ru' && this.loadedLanguages.has('ru')) {
                return this.translations['ru'];
            }
            return null;
        }
    }

    /**
     * Change the current language
     */
    async setLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.warn(`Language ${lang} is not supported`);
            return false;
        }

        await this.loadLanguage(lang);
        this.currentLang = lang;
        localStorage.setItem('spaceport_language', lang);
        this.updateAllElements();

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));

        return true;
    }

    /**
     * Get a translation by key path (e.g., "sectors.a.name")
     */
    t(keyPath, params = {}) {
        const keys = keyPath.split('.');
        let value = this.translations[this.currentLang];

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                console.warn(`Translation key not found: ${keyPath}`);
                return keyPath;
            }
        }

        // Replace parameters like {n} or {percent}
        if (typeof value === 'string') {
            return value.replace(/\{(\w+)\}/g, (match, param) => {
                return params[param] !== undefined ? params[param] : match;
            });
        }

        return value;
    }

    /**
     * Update all elements with data-i18n attribute
     */
    updateAllElements() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const params = el.getAttribute('data-i18n-params');
            const parsedParams = params ? JSON.parse(params) : {};
            
            const translation = this.t(key, parsedParams);
            
            // Check if we should update innerHTML or textContent
            if (el.hasAttribute('data-i18n-html')) {
                el.innerHTML = translation;
            } else {
                el.textContent = translation;
            }
        });

        // Update placeholders
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });

        // Update titles
        const titles = document.querySelectorAll('[data-i18n-title]');
        titles.forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            el.title = this.t(key);
        });
    }

    /**
     * Update a specific element
     */
    updateElement(element, key, params = {}) {
        element.textContent = this.t(key, params);
    }

    /**
     * Get current language code
     */
    getLang() {
        return this.currentLang;
    }

    /**
     * Get all supported languages
     */
    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    /**
     * Check if a language is loaded
     */
    isLanguageLoaded(lang) {
        return this.loadedLanguages.has(lang);
    }
}

// Create singleton instance
const i18n = new I18n();

// Export for use in other modules
window.i18n = i18n;

export default i18n;
