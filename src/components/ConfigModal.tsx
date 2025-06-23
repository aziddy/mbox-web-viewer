import React, { useState, useEffect } from 'react';
import { EmailConfig } from '../types';
import { ConfigManager } from '../utils/configManager';

interface ConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfigChange: (config: EmailConfig) => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, onConfigChange }) => {
    const [config, setConfig] = useState<EmailConfig>(ConfigManager.getDefaultConfig());

    useEffect(() => {
        if (isOpen) {
            setConfig(ConfigManager.loadConfig());
        }
    }, [isOpen]);

    const handleSave = () => {
        ConfigManager.saveConfig(config);
        onConfigChange(config);
        onClose();
    };

    const handleReset = () => {
        const defaultConfig = ConfigManager.getDefaultConfig();
        setConfig(defaultConfig);
        ConfigManager.resetConfig();
        onConfigChange(defaultConfig);
    };

    const handleChange = (key: keyof EmailConfig, value: boolean) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>⚙️ Email Processing Settings</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="config-section">
                        <h3>📧 Email Encoding</h3>

                        <div className="config-item">
                            <label className="config-label">
                                <input
                                    type="checkbox"
                                    checked={config.decodeQuotedPrintable}
                                    onChange={(e) => handleChange('decodeQuotedPrintable', e.target.checked)}
                                />
                                <span className="config-text">
                                    <strong>Decode Quoted-Printable & MIME</strong>
                                    <small>Fix broken lines with '=' characters, decode hex values, and handle MIME encoded subjects</small>
                                </span>
                            </label>
                        </div>

                        <div className="config-item">
                            <label className="config-label">
                                <input
                                    type="checkbox"
                                    checked={config.autoDetectEncoding}
                                    onChange={(e) => handleChange('autoDetectEncoding', e.target.checked)}
                                />
                                <span className="config-text">
                                    <strong>Auto-detect Encoding Issues</strong>
                                    <small>Automatically detect and fix common email encoding problems</small>
                                </span>
                            </label>
                        </div>

                        <div className="config-item">
                            <label className="config-label">
                                <input
                                    type="checkbox"
                                    checked={config.preserveOriginalFormatting}
                                    onChange={(e) => handleChange('preserveOriginalFormatting', e.target.checked)}
                                />
                                <span className="config-text">
                                    <strong>Preserve Original Formatting</strong>
                                    <small>Keep original line breaks and spacing when possible</small>
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="config-info">
                        <h4>ℹ️ About These Settings</h4>
                        <ul>
                            <li><strong>Quoted-Printable & MIME:</strong> Fixes emails with broken lines ending in '=', decodes hex characters like =3D, and handles MIME encoded subjects like =?UTF-8?Q?text?=</li>
                            <li><strong>Auto-detect:</strong> Automatically applies fixes when encoding issues are detected</li>
                            <li><strong>Original Formatting:</strong> Maintains the original email structure and spacing</li>
                        </ul>
                        <p><small>Settings are saved locally in your browser and will persist between sessions.</small></p>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={handleReset}>
                        🔄 Reset to Defaults
                    </button>
                    <div className="modal-actions">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="btn" onClick={handleSave}>
                            💾 Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfigModal; 