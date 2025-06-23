import { EmailConfig } from '../types';

export class EmailProcessor {
    static decodeQuotedPrintable(text: string): string {
        // Handle quoted-printable encoding where =XX represents hex characters
        // and = at end of line represents soft line break
        return text
            .replace(/=\r?\n/g, '') // Remove soft line breaks
            .replace(/=([0-9A-Fa-f]{2})/g, (match, hex) => {
                try {
                    return String.fromCharCode(parseInt(hex, 16));
                } catch {
                    return match; // Return original if parsing fails
                }
            });
    }

    static decodeMimeEncodedWords(text: string): string {
        // Handle MIME encoded words like =?UTF-8?Q?text?= or =?UTF-8?B?base64?=
        return text.replace(/=\?([^?]+)\?([QB])\?([^?]*)\?=/gi, (match, charset, encoding, encodedText) => {
            try {
                if (encoding.toUpperCase() === 'Q') {
                    // Quoted-printable encoding
                    if (charset.toUpperCase() === 'UTF-8') {
                        // For UTF-8 quoted-printable, we need to decode the hex bytes directly
                        return this.decodeUtf8QuotedPrintable(encodedText);
                    } else {
                        // For other charsets, use regular quoted-printable decoding
                        return this.decodeQuotedPrintable(encodedText);
                    }
                } else if (encoding.toUpperCase() === 'B') {
                    // Base64 encoding
                    const decoded = atob(encodedText);

                    // Handle UTF-8 charset properly
                    if (charset.toUpperCase() === 'UTF-8') {
                        return this.fixUtf8Encoding(decoded);
                    }

                    return decoded;
                }
            } catch (error) {
                console.warn('Failed to decode MIME encoded word:', match, error);
            }
            return match; // Return original if decoding fails
        });
    }

    static decodeUtf8QuotedPrintable(text: string): string {
        // Decode UTF-8 quoted-printable by converting hex bytes to UTF-8 characters
        const bytes: number[] = [];

        // Split by =XX patterns and convert to bytes
        const parts = text.split(/(=([0-9A-Fa-f]{2}))/g);

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (part.startsWith('=') && part.length === 3) {
                // This is a hex byte
                const hex = part.substring(1);
                bytes.push(parseInt(hex, 16));
            } else if (part.length === 2 && part.match(/^[0-9A-Fa-f]{2}$/)) {
                // This is the hex part from the split, skip it
                continue;
            } else {
                // This is regular text, convert to bytes
                for (let j = 0; j < part.length; j++) {
                    bytes.push(part.charCodeAt(j));
                }
            }
        }

        // Convert bytes to UTF-8 string
        try {
            const decoder = new TextDecoder('utf-8');
            return decoder.decode(new Uint8Array(bytes));
        } catch (error) {
            console.warn('Failed to decode UTF-8 bytes:', error);
            // Fallback to regular quoted-printable decoding
            return this.decodeQuotedPrintable(text);
        }
    }

    static fixUtf8Encoding(text: string): string {
        try {
            // For UTF-8, we need to handle the byte sequences properly
            // Convert the string to a proper UTF-8 representation
            const bytes = new Uint8Array(text.length);
            for (let i = 0; i < text.length; i++) {
                bytes[i] = text.charCodeAt(i);
            }

            // Use TextDecoder to properly decode UTF-8 bytes
            const decoder = new TextDecoder('utf-8');
            return decoder.decode(bytes);
        } catch (error) {
            console.warn('Failed to fix UTF-8 encoding:', error);
            return text;
        }
    }

    static processEmailContent(content: string, config: EmailConfig): string {
        let processedContent = content;

        if (config.decodeQuotedPrintable) {
            processedContent = this.decodeQuotedPrintable(processedContent);
        }

        if (config.autoDetectEncoding) {
            // Auto-detect if content appears to be quoted-printable encoded
            const hasQuotedPrintable = /=\r?\n/.test(content) || /=([0-9A-Fa-f]{2})/.test(content);
            if (hasQuotedPrintable && !config.decodeQuotedPrintable) {
                processedContent = this.decodeQuotedPrintable(processedContent);
            }
        }

        return processedContent;
    }

    static processEmailHeaders(headers: Record<string, string>, config: EmailConfig): Record<string, string> {
        const processedHeaders: Record<string, string> = {};

        for (const [key, value] of Object.entries(headers)) {
            let processedValue = value;

            // Always decode MIME encoded words in headers
            processedValue = this.decodeMimeEncodedWords(processedValue);

            // Apply quoted-printable decoding if enabled
            if (config.decodeQuotedPrintable) {
                processedValue = this.decodeQuotedPrintable(processedValue);
            }

            processedHeaders[key] = processedValue;
        }

        return processedHeaders;
    }

    static detectEncodingIssues(content: string): {
        hasQuotedPrintable: boolean;
        hasSoftBreaks: boolean;
        hasHexEncoding: boolean;
        hasMimeEncodedWords: boolean;
    } {
        return {
            hasQuotedPrintable: /=([0-9A-Fa-f]{2})/.test(content),
            hasSoftBreaks: /=\r?\n/.test(content),
            hasHexEncoding: /=([0-9A-Fa-f]{2})/.test(content) || /=\r?\n/.test(content),
            hasMimeEncodedWords: /=\?[^?]+\?[QB]\?[^?]*\?=/.test(content)
        };
    }
} 