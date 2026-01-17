/**
 * Generates a human-readable case ID in format "WH-XXX-YYY"
 * where XXX is a 3-digit number and YYY is a 3-letter code
 */
export function generateCaseId(): string {
    const numbers = Math.floor(100 + Math.random() * 900).toString();
    const letters = generateRandomLetters(3);
    return `WH-${numbers}-${letters}`;
}

/**
 * Generates a random password with mixed characters
 */
export function generatePassword(length: number = 12): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function generateRandomLetters(length: number): string {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed confusing letters I, O
    let result = '';
    for (let i = 0; i < length; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return result;
}
