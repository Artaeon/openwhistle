import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { config } from '../config/env';
import { sanitizeFilename } from '../utils/sanitize';

// Ensure uploads directory exists
const uploadsDir = path.resolve(config.uploadsDir);
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Multer storage configuration
 * Files are renamed to UUIDs to prevent execution of malicious scripts
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const { ext } = sanitizeFilename(file.originalname);
        // Generate UUID-based filename to prevent malicious file execution
        const safeFilename = `${uuidv4()}${ext}`;
        cb(null, safeFilename);
    },
});

/**
 * File filter to restrict upload types
 */
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Maximum file size check is handled by limits
    // Here we can add additional MIME type checks if needed
    const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
        'application/zip',
        'application/x-rar-compressed',
        'application/x-7z-compressed',
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false); // Silently reject unsupported types
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size
        files: 5, // Maximum 5 files per request
    },
});
