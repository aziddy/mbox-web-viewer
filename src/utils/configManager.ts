import { EmailConfig } from '../types';

const CONFIG_KEY = 'mbox-viewer-config';

export class ConfigManager {
    static getDefaultConfig(): EmailConfig {
        return {
            decodeQuotedPrintable: true,
            autoDetectEncoding: true,
            preserveOriginalFormatting: false
        };
    }

    static loadConfig(): EmailConfig {
        try {
            const saved = localStorage.getItem(CONFIG_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to ensure all properties exist
                return { ...this.getDefaultConfig(), ...parsed };
            }
        } catch (error) {
            console.warn('Failed to load config from localStorage:', error);
        }
        return this.getDefaultConfig();
    }

    static saveConfig(config: EmailConfig): void {
        try {
            localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        } catch (error) {
            console.warn('Failed to save config to localStorage:', error);
        }
    }

    static resetConfig(): void {
        try {
            localStorage.removeItem(CONFIG_KEY);
        } catch (error) {
            console.warn('Failed to reset config:', error);
        }
    }
} 