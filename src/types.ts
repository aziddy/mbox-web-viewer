export interface Email {
    id: string;
    subject: string;
    from: string;
    to: string;
    date: string;
    body: string;
    headers: Record<string, string>;
}

export interface MboxStats {
    totalEmails: number;
    dateRange: {
        earliest: string;
        latest: string;
    } | null;
    senders: string[];
}

export interface EmailConfig {
    decodeQuotedPrintable: boolean;
    autoDetectEncoding: boolean;
    preserveOriginalFormatting: boolean;
} 