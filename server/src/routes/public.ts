import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateCaseId, generatePassword } from '../services/caseId';
import { sanitizeFilename } from '../utils/sanitize';
import { upload } from '../middleware/upload';
import { submitRateLimiter } from '../middleware/rateLimiter';
import { notifyAdminsNewReport } from '../services/email';

const router = Router();
const prisma = new PrismaClient();

// Valid report categories
const VALID_CATEGORIES = [
    'Korruption',
    'Diebstahl',
    'Belästigung',
    'Datenschutz',
    'Sonstiges',
];

/**
 * POST /api/reports
 * Submit a new whistleblower report
 */
router.post('/reports', submitRateLimiter, upload.array('files', 5), async (req, res) => {
    try {
        const { content, category } = req.body;

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return res.status(400).json({ error: 'Report content is required' });
        }

        // Validate category (default to 'Sonstiges' if invalid)
        const validCategory = VALID_CATEGORIES.includes(category) ? category : 'Sonstiges';

        // Generate unique case ID and password
        let accessCode = generateCaseId();
        let existingReport = await prisma.report.findUnique({ where: { accessCode } });

        // Ensure unique case ID
        while (existingReport) {
            accessCode = generateCaseId();
            existingReport = await prisma.report.findUnique({ where: { accessCode } });
        }

        const password = generatePassword(12);
        const passwordHash = await bcrypt.hash(password, 12);

        // Create report with initial message
        const report = await prisma.report.create({
            data: {
                accessCode,
                passwordHash,
                category: validCategory,
                messages: {
                    create: {
                        senderType: 'WHISTLEBLOWER',
                        content: content.trim(),
                        attachments: {
                            create: (req.files as Express.Multer.File[] || []).map(file => {
                                const { sanitized } = sanitizeFilename(file.originalname);
                                return {
                                    filePath: file.filename,
                                    originalName: sanitized,
                                };
                            }),
                        },
                    },
                },
            },
            include: {
                messages: {
                    include: {
                        attachments: true,
                    },
                },
            },
        });

        // Send email notification to admins (async, non-blocking)
        notifyAdminsNewReport(accessCode).catch(err => {
            console.error('Email notification failed:', err);
        });

        // Return credentials to the user
        res.status(201).json({
            success: true,
            credentials: {
                caseId: accessCode,
                password: password, // Plain text, shown only once
            },
            message: 'Your report has been submitted. Save these credentials - they cannot be recovered.',
        });
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: 'Failed to create report' });
    }
});

/**
 * GET /api/categories
 * Get list of valid report categories
 */
router.get('/categories', (req, res) => {
    res.json({ categories: VALID_CATEGORIES });
});

export default router;
