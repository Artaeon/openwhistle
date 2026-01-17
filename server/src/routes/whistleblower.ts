import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { authenticateWhistleblower, generateWhistleblowerToken, AuthRequest } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import { upload } from '../middleware/upload';
import { sanitizeFilename } from '../utils/sanitize';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /api/whistleblower/login
 * Authenticate whistleblower with case ID and password
 */
router.post('/login', authRateLimiter, async (req, res) => {
    try {
        const { caseId, password } = req.body;

        if (!caseId || !password) {
            return res.status(400).json({ error: 'Case ID and password are required' });
        }

        const report = await prisma.report.findUnique({
            where: { accessCode: caseId },
        });

        if (!report) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, report.passwordHash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateWhistleblowerToken(report.id);

        res.json({
            token,
            caseId: report.accessCode,
            status: report.status,
        });
    } catch (error) {
        console.error('Whistleblower login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * GET /api/whistleblower/messages
 * Get all messages for the authenticated report
 */
router.get('/messages', authenticateWhistleblower, async (req: AuthRequest, res) => {
    try {
        const report = await prisma.report.findUnique({
            where: { id: req.reportId },
            include: {
                messages: {
                    include: {
                        attachments: {
                            select: {
                                id: true,
                                originalName: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        res.json({
            caseId: report.accessCode,
            status: report.status,
            messages: report.messages.map(msg => ({
                id: msg.id,
                senderType: msg.senderType,
                content: msg.content,
                createdAt: msg.createdAt,
                attachments: msg.attachments,
            })),
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

/**
 * POST /api/whistleblower/messages
 * Send a new message as the whistleblower
 */
router.post('/messages', authenticateWhistleblower, upload.array('files', 5), async (req: AuthRequest, res) => {
    try {
        const { content } = req.body;

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return res.status(400).json({ error: 'Message content is required' });
        }

        const message = await prisma.message.create({
            data: {
                reportId: req.reportId!,
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
            include: {
                attachments: {
                    select: {
                        id: true,
                        originalName: true,
                    },
                },
            },
        });

        res.status(201).json({
            id: message.id,
            senderType: message.senderType,
            content: message.content,
            createdAt: message.createdAt,
            attachments: message.attachments,
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

export default router;
