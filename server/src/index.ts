import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { config } from './config/env';
import { apiRateLimiter } from './middleware/rateLimiter';

// Import routes
import publicRoutes from './routes/public';
import whistleblowerRoutes from './routes/whistleblower';
import adminRoutes from './routes/admin';
import attachmentRoutes from './routes/attachments';
import usersRoutes from './routes/users';
import settingsRoutes from './routes/settings';

const app = express();
const prisma = new PrismaClient();

// =============================================================================
// SECURITY: No-Log Policy - Custom Morgan format that excludes IP addresses
// =============================================================================
morgan.token('no-ip', (req) => {
    return `${req.method} ${req.url}`;
});

app.use(morgan(':no-ip :status :response-time ms', {
    // Skip logging for health checks
    skip: (req) => req.url === '/health',
}));

// =============================================================================
// Middleware
// =============================================================================
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// =============================================================================
// Static file serving for uploads (images, documents)
// =============================================================================
app.use('/uploads', express.static(config.uploadsDir));

// Apply general rate limiting
app.use('/api/', apiRateLimiter);

// =============================================================================
// Routes
// =============================================================================
app.use('/api', publicRoutes);
app.use('/api/whistleblower', whistleblowerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/users', usersRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/attachments', attachmentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// =============================================================================
// Error handling
// =============================================================================
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

// =============================================================================
// Database initialization and server start
// =============================================================================
async function initializeDatabase() {
    try {
        // Check if admin user exists, create if not
        const adminExists = await prisma.adminUser.findUnique({
            where: { username: 'admin' },
        });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash(config.adminInitPassword, 12);
            await prisma.adminUser.create({
                data: {
                    username: 'admin',
                    passwordHash: hashedPassword,
                    isSuper: true,
                },
            });
            console.log('Created default admin user');
        }

        // Initialize default system settings
        const defaultSettings = [
            { key: 'COMPANY_NAME', value: 'Interne Meldestelle' },
            { key: 'WELCOME_TEXT', value: 'Melden Sie Missstände sicher und vertraulich. Ihre Identität wird geschützt.' },
        ];

        for (const setting of defaultSettings) {
            await prisma.systemSetting.upsert({
                where: { key: setting.key },
                update: {},
                create: setting,
            });
        }
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}

async function main() {
    await initializeDatabase();

    app.listen(config.port, () => {
        console.log(`OpenWhistle server running on port ${config.port}`);
        console.log(`Environment: ${config.nodeEnv}`);
    });
}

main().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down...');
    await prisma.$disconnect();
    process.exit(0);
});
