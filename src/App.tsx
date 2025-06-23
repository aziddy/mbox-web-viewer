import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import { MboxParser } from './utils/mboxParser';
import { Email, MboxStats } from './types';
import { ConfigProvider } from './contexts/ConfigContext';

type AppState = 'upload' | 'list' | 'detail';

function App() {
    const [state, setState] = useState<AppState>('upload');
    const [emails, setEmails] = useState<Email[]>([]);
    const [stats, setStats] = useState<MboxStats | null>(null);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = async (file: File) => {
        setLoading(true);
        setError(null);

        try {
            console.log('Processing file:', file.name, 'Size:', file.size, 'bytes');

            const { emails: parsedEmails, stats: fileStats } = await MboxParser.parseFile(file);

            console.log('Parsed', parsedEmails.length, 'emails');

            if (parsedEmails.length === 0) {
                setError('No emails found in this file. Please ensure it\'s a valid MBOX file.');
                setLoading(false);
                return;
            }

            setEmails(parsedEmails);
            setStats(fileStats);
            setState('list');
        } catch (err) {
            console.error('Error parsing MBOX file:', err);
            setError('Error parsing MBOX file. Please ensure it\'s a valid MBOX format.');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSelect = (email: Email) => {
        setSelectedEmail(email);
        setState('detail');
    };

    const handleBackToList = () => {
        setSelectedEmail(null);
        setState('list');
    };

    const handleBackToUpload = () => {
        setEmails([]);
        setStats(null);
        setSelectedEmail(null);
        setError(null);
        setState('upload');
    };

    return (
        <ConfigProvider>
            <div className="App">
                {error && (
                    <div className="container">
                        <div className="error">
                            <strong>Error:</strong> {error}
                        </div>
                    </div>
                )}

                {state === 'upload' && (
                    <FileUpload
                        onFileSelect={handleFileSelect}
                        loading={loading}
                    />
                )}

                {state === 'list' && emails.length > 0 && stats && (
                    <EmailList
                        emails={emails}
                        stats={stats}
                        onEmailSelect={handleEmailSelect}
                        onBack={handleBackToUpload}
                    />
                )}

                {state === 'detail' && selectedEmail && (
                    <EmailDetail
                        email={selectedEmail}
                        onBack={handleBackToList}
                    />
                )}
            </div>
        </ConfigProvider>
    );
}

export default App; 