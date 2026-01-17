// Environment configuration
// In production, env vars are passed via Docker. For local dev, use a .env file.
if (process.env.NODE_ENV !== 'production') {
    // dotenv is optional for local development
    try {
        require('dotenv').config();
    } catch {
        // dotenv not installed, using system env vars
    }
}

export const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    nodeEnv: process.env.NODE_ENV || 'development',
    adminInitPassword: process.env.ADMIN_INIT_PASSWORD || 'admin123',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    appUrl: process.env.APP_URL || 'http://localhost:3001',
    uploadsDir: process.env.UPLOADS_DIR || '/app/data/uploads',

    // SMTP Configuration for email notifications
    smtp: {
        enabled: !!(process.env.SMTP_HOST && process.env.SMTP_USER),
        host: process.env.SMTP_HOST || '',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
        from: process.env.SMTP_FROM || 'meldestelle@example.com',
    },
};

// Validate production requirements
if (config.nodeEnv === 'production' && config.jwtSecret === 'dev-secret-change-in-production') {
    console.error('ERROR: JWT_SECRET must be set in production!');
    process.exit(1);
}
