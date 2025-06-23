import { Email, MboxStats } from '../types';
import { EmailProcessor } from './emailProcessor';
import { ConfigManager } from './configManager';

export class MboxParser {
    static async parseFile(file: File): Promise<{ emails: Email[], stats: MboxStats }> {
        const text = await file.text();
        const emails = this.parseMboxContent(text);
        const stats = this.generateStats(emails);

        return { emails, stats };
    }

    private static parseMboxContent(content: string): Email[] {
        const emails: Email[] = [];

        // Split by "From " at the beginning of lines (mbox format delimiter)
        const emailBlocks = content.split(/^From /gm).filter(block => block.trim());

        emailBlocks.forEach((block, index) => {
            if (!block.trim()) return;

            // Add back the "From " prefix that was removed by split
            const fullBlock = index === 0 ? block : 'From ' + block;
            const email = this.parseEmailBlock(fullBlock, index.toString());

            if (email) {
                emails.push(email);
            }
        });

        return emails;
    }

    private static parseEmailBlock(block: string, id: string): Email | null {
        try {
            const lines = block.split('\n');
            const headers: Record<string, string> = {};
            let bodyStartIndex = 0;

            // Parse headers
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                // Empty line indicates end of headers
                if (line.trim() === '') {
                    bodyStartIndex = i + 1;
                    break;
                }

                // Header continuation (starts with space or tab)
                if (line.match(/^\s/) && Object.keys(headers).length > 0) {
                    const lastKey = Object.keys(headers).pop()!;
                    headers[lastKey] += ' ' + line.trim();
                    continue;
                }

                // Parse header line
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                    const key = line.substring(0, colonIndex).trim();
                    const value = line.substring(colonIndex + 1).trim();
                    headers[key.toLowerCase()] = value;
                }
            }

            // Extract body
            const body = lines.slice(bodyStartIndex).join('\n').trim();

            // Process headers with email processor
            const config = ConfigManager.loadConfig();
            const processedHeaders = EmailProcessor.processEmailHeaders(headers, config);

            // Extract essential fields from processed headers
            const subject = processedHeaders['subject'] || '(No Subject)';
            const from = this.parseEmailAddress(processedHeaders['from'] || '');
            const to = this.parseEmailAddress(processedHeaders['to'] || '');
            const date = processedHeaders['date'] || '';

            return {
                id,
                subject,
                from,
                to,
                date,
                body,
                headers: processedHeaders
            };
        } catch (error) {
            console.error('Error parsing email block:', error);
            return null;
        }
    }

    private static parseEmailAddress(emailString: string): string {
        if (!emailString) return '';

        // Handle various email formats
        // "Name" <email@domain.com>
        const nameEmailMatch = emailString.match(/^"?([^"]*)"?\s*<(.+)>$/);
        if (nameEmailMatch) {
            const name = nameEmailMatch[1].trim();
            const email = nameEmailMatch[2].trim();
            return name ? `${name} <${email}>` : email;
        }

        // Just email@domain.com
        const emailMatch = emailString.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (emailMatch) {
            return emailMatch[1];
        }

        return emailString.trim();
    }

    private static generateStats(emails: Email[]): MboxStats {
        const senders = Array.from(new Set(emails.map(email => email.from)));

        let dateRange = null;
        if (emails.length > 0) {
            const dates = emails
                .map(email => new Date(email.date))
                .filter(date => !isNaN(date.getTime()))
                .sort((a, b) => a.getTime() - b.getTime());

            if (dates.length > 0) {
                dateRange = {
                    earliest: dates[0].toLocaleDateString(),
                    latest: dates[dates.length - 1].toLocaleDateString()
                };
            }
        }

        return {
            totalEmails: emails.length,
            dateRange,
            senders
        };
    }
} 