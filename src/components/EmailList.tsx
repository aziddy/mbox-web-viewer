import React, { useState, useMemo } from 'react';
import { Email, MboxStats } from '../types';

interface EmailListProps {
    emails: Email[];
    stats: MboxStats;
    onEmailSelect: (email: Email) => void;
    onBack: () => void;
}

const EmailList: React.FC<EmailListProps> = ({ emails, stats, onEmailSelect, onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEmails = useMemo(() => {
        if (!searchTerm.trim()) return emails;

        const term = searchTerm.toLowerCase();
        return emails.filter(email =>
            email.subject.toLowerCase().includes(term) ||
            email.from.toLowerCase().includes(term) ||
            email.body.toLowerCase().includes(term)
        );
    }, [emails, searchTerm]);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
            return dateString;
        }
    };

    const getEmailPreview = (body: string) => {
        // Remove common email signatures and quoted content
        const lines = body.split('\n');
        const contentLines = lines.filter(line =>
            !line.startsWith('>') &&
            !line.startsWith('On ') &&
            !line.includes('wrote:') &&
            line.trim().length > 0
        );

        const preview = contentLines.slice(0, 3).join(' ').substring(0, 150);
        return preview.length < body.length ? preview + '...' : preview;
    };

    return (
        <div className="container">
            <button className="btn back-btn" onClick={onBack}>
                ← Back to Upload
            </button>

            <div className="stats">
                <h3>📊 MBOX Statistics</h3>
                <p><strong>Total Emails:</strong> {stats.totalEmails}</p>
                {stats.dateRange && (
                    <p><strong>Date Range:</strong> {stats.dateRange.earliest} - {stats.dateRange.latest}</p>
                )}
                <p><strong>Unique Senders:</strong> {stats.senders.length}</p>
            </div>

            <input
                type="text"
                className="search-box"
                placeholder="🔍 Search emails by subject, sender, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="email-list">
                {filteredEmails.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                        {searchTerm ? 'No emails match your search.' : 'No emails found in this MBOX file.'}
                    </div>
                ) : (
                    filteredEmails.map((email) => (
                        <div
                            key={email.id}
                            className="email-item"
                            onClick={() => onEmailSelect(email)}
                        >
                            <div className="email-header">
                                <div>
                                    <div className="email-subject">{email.subject}</div>
                                    <div className="email-from">From: {email.from}</div>
                                </div>
                                <div className="email-date">
                                    {formatDate(email.date)}
                                </div>
                            </div>
                            <div className="email-preview">
                                {getEmailPreview(email.body)}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {searchTerm && (
                <div style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
                    Showing {filteredEmails.length} of {emails.length} emails
                </div>
            )}
        </div>
    );
};

export default EmailList; 