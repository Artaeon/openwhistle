import path from 'path';

/**
 * Sanitizes a filename by removing potentially dangerous characters
 * and extracting only the file extension
 */
export function sanitizeFilename(originalName: string): { ext: string; sanitized: string } {
    // Get the file extension
    const ext = path.extname(originalName).toLowerCase();

    // Whitelist of allowed extensions
    const allowedExtensions = [
        '.pdf', '.doc', '.docx', '.txt', '.rtf',
        '.jpg', '.jpeg', '.png', '.gif', '.bmp',
        '.xls', '.xlsx', '.csv',
        '.zip', '.rar', '.7z'
    ];

    // If extension is not in whitelist, default to .bin
    const safeExt = allowedExtensions.includes(ext) ? ext : '.bin';

    // Sanitize original name for storage (remove path traversal attempts, etc.)
    const sanitized = path.basename(originalName)
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .substring(0, 255);

    return { ext: safeExt, sanitized };
}

/**
 * Validates input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string): string {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
}
