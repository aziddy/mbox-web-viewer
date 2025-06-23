import React, { createContext, useContext, useState, useEffect } from 'react';
import { EmailConfig } from '../types';
import { ConfigManager } from '../utils/configManager';

interface ConfigContextType {
    config: EmailConfig;
    updateConfig: (newConfig: EmailConfig) => void;
    resetConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};

interface ConfigProviderProps {
    children: React.ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
    const [config, setConfig] = useState<EmailConfig>(ConfigManager.getDefaultConfig());

    useEffect(() => {
        // Load config from localStorage on mount
        setConfig(ConfigManager.loadConfig());
    }, []);

    const updateConfig = (newConfig: EmailConfig) => {
        setConfig(newConfig);
        ConfigManager.saveConfig(newConfig);
    };

    const resetConfig = () => {
        const defaultConfig = ConfigManager.getDefaultConfig();
        setConfig(defaultConfig);
        ConfigManager.resetConfig();
    };

    return (
        <ConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};

export { ConfigContext }; 