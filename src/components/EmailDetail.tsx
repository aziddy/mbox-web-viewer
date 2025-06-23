import React, { useState } from 'react';
import { Email, EmailConfig } from '../types';
import { EmailProcessor } from '../utils/emailProcessor';
import { useConfig } from '../contexts/ConfigContext';
import ConfigModal from './ConfigModal';

interface EmailDetailProps {
    email: Email;
    onBack: () => void;
}

type RenderMode = 'plain' | 'safe-html' | 'unsafe-html';

const EmailDetail: React.FC<EmailDetailProps> = ({ email, onBack }) => {
    const [renderMode, setRenderMode] = useState<RenderMode>('plain');
    const [showConfig, setShowConfig] = useState(false);
    const { config } = useConfig();

    const formatEmailBody = (body: string) => {
        const processedBody = EmailProcessor.processEmailContent(body, config);

        // Basic formatting for better readability
        return processedBody
            .split('\n')
            .map((line, index) => (
                <div key={index} style={{
                    marginBottom: line.trim() === '' ? '10px' : '0',
                    fontStyle: line.startsWith('>') ? 'italic' : 'normal',
                    color: line.startsWith('>') ? '#888' : 'inherit',
                    paddingLeft: line.startsWith('>') ? '20px' : '0'
                }}>
                    {line || '\u00A0'}
                </div>
            ));
    };

    const detectHtmlContent = (body: string): boolean => {
        // Check if the email body contains HTML tags
        const htmlTags = /<\s*([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/gi;
        return htmlTags.test(body);
    };

    const sanitizeHtml = (html: string): string => {
        // Basic HTML sanitization - remove potentially dangerous elements
        return html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '');
    };

    const renderEmailContent = () => {
        const hasHtml = detectHtmlContent(email.body);
        const processedBody = EmailProcessor.processEmailContent(email.body, config);
        const encodingIssues = EmailProcessor.detectEncodingIssues(email.body);

        if (renderMode === 'unsafe-html' && hasHtml) {
            return (
                <div
                    className="email-content html-content unsafe-html"
                    dangerouslySetInnerHTML={{
                        __html: processedBody
                    }}
                    style={{
                        border: '2px solid #dc3545',
                        padding: '20px',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        maxWidth: '100%',
                        overflow: 'auto'
                    }}
                />
            );
        } else if (renderMode === 'safe-html' && hasHtml) {
            return (
                <div
                    className="email-content html-content"
                    dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(processedBody)
                    }}
                    style={{
                        border: '1px solid #e9ecef',
                        padding: '20px',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        maxWidth: '100%',
                        overflow: 'auto'
                    }}
                />
            );
        } else {
            return (
                <div className="email-content">
                    {formatEmailBody(email.body)}
                </div>
            );
        }
    };

    const getWarningBanner = () => {
        if (renderMode === 'unsafe-html') {
            return (
                <div style={{
                    backgroundColor: '#f8d7da',
                    border: '2px solid #dc3545',
                    padding: '15px',
                    borderRadius: '6px',
                    marginBottom: '20px',
                    fontSize: '0.9rem',
                    color: '#721c24'
                }}>
                    <strong>🚨 UNSAFE HTML MODE:</strong> Displaying unfiltered HTML content. This may execute scripts, load external resources, or contain malicious content. Use with extreme caution and only with trusted emails.
                </div>
            );
        } else if (renderMode === 'safe-html') {
            return (
                <div style={{
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    padding: '10px',
                    borderRadius: '6px',
                    marginBottom: '20px',
                    fontSize: '0.9rem',
                    color: '#856404'
                }}>
                    <strong>⚠️ SAFE HTML MODE:</strong> Displaying email with original formatting. Scripts and dangerous content have been filtered for security.
                </div>
            );
        }
        return null;
    };

    const getEncodingWarning = () => {
        const encodingIssues = EmailProcessor.detectEncodingIssues(email.body);
        const hasIssues = encodingIssues.hasHexEncoding || encodingIssues.hasMimeEncodedWords;

        if (hasIssues && !config.decodeQuotedPrintable) {
            return (
                <div style={{
                    backgroundColor: '#e2e3e5',
                    border: '1px solid #d6d8db',
                    padding: '10px',
                    borderRadius: '6px',
                    marginBottom: '20px',
                    fontSize: '0.9rem',
                    color: '#383d41'
                }}>
                    <strong>🔧 Encoding Issues Detected:</strong> This email appears to have encoding problems
                    {encodingIssues.hasMimeEncodedWords && ' (MIME encoded words)'}
                    {encodingIssues.hasHexEncoding && ' (quoted-printable format)'}.
                    <button
                        className="btn-link"
                        onClick={() => setShowConfig(true)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#667eea',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            marginLeft: '5px'
                        }}
                    >
                        Configure settings
                    </button>
                </div>
            );
        }
        return null;
    };

    const importantHeaders = ['from', 'to', 'cc', 'bcc', 'date', 'subject'];
    const displayHeaders = Object.entries(email.headers)
        .filter(([key]) => importantHeaders.includes(key.toLowerCase()))
        .sort(([a], [b]) => {
            const orderA = importantHeaders.indexOf(a.toLowerCase());
            const orderB = importantHeaders.indexOf(b.toLowerCase());
            return orderA - orderB;
        });

    const hasHtml = detectHtmlContent(email.body);

    return (
        <div className="container">
            <button className="btn back-btn" onClick={onBack}>
                ← Back to Email List
            </button>

            <div className="email-detail">
                <div className="email-detail-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <h2 style={{ margin: 0, flex: 1 }}>{email.subject}</h2>
                        <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
                            <button
                                className="btn"
                                onClick={() => setShowConfig(true)}
                                style={{
                                    backgroundColor: '#17a2b8',
                                    fontSize: '0.85rem',
                                    padding: '6px 12px'
                                }}
                            >
                                ⚙️ Settings
                            </button>
                            {hasHtml && (
                                <>
                                    <button
                                        className="btn"
                                        onClick={() => setRenderMode('plain')}
                                        style={{
                                            backgroundColor: renderMode === 'plain' ? '#28a745' : '#6c757d',
                                            fontSize: '0.85rem',
                                            padding: '6px 12px'
                                        }}
                                    >
                                        📄 Plain Text
                                    </button>
                                    <button
                                        className="btn"
                                        onClick={() => setRenderMode('safe-html')}
                                        style={{
                                            backgroundColor: renderMode === 'safe-html' ? '#28a745' : '#6c757d',
                                            fontSize: '0.85rem',
                                            padding: '6px 12px'
                                        }}
                                    >
                                        🌐 Safe HTML
                                    </button>
                                    <button
                                        className="btn"
                                        onClick={() => setRenderMode('unsafe-html')}
                                        style={{
                                            backgroundColor: renderMode === 'unsafe-html' ? '#dc3545' : '#6c757d',
                                            fontSize: '0.85rem',
                                            padding: '6px 12px',
                                            border: renderMode === 'unsafe-html' ? '2px solid #dc3545' : 'none'
                                        }}
                                    >
                                        ⚠️ Full HTML
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="meta">
                        {displayHeaders.map(([key, value]) => (
                            <div key={key} style={{ marginBottom: '8px' }}>
                                <strong style={{ textTransform: 'capitalize', minWidth: '60px', display: 'inline-block' }}>
                                    {key}:
                                </strong> {value}
                            </div>
                        ))}
                    </div>
                </div>

                {getEncodingWarning()}
                {getWarningBanner()}

                {renderEmailContent()}

                {Object.keys(email.headers).length > importantHeaders.length && (
                    <details style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#666' }}>
                            View All Headers ({Object.keys(email.headers).length} total)
                        </summary>
                        <div style={{ marginTop: '15px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                            {Object.entries(email.headers).map(([key, value]) => (
                                <div key={key} style={{ marginBottom: '5px', wordBreak: 'break-all' }}>
                                    <strong>{key}:</strong> {value}
                                </div>
                            ))}
                        </div>
                    </details>
                )}
            </div>

            <ConfigModal
                isOpen={showConfig}
                onClose={() => setShowConfig(false)}
                onConfigChange={() => {
                    // Force re-render to apply new config
                    setRenderMode(renderMode);
                }}
            />
        </div>
    );
};

export default EmailDetail; 