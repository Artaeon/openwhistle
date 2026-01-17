import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { authenticateAdmin, generateAdminToken, AuthRequest } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import { upload } from '../middleware/upload';
import { sanitizeFilename } from '../utils/sanitize';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /api/admin/login
 * Authenticate admin user
 */
router.post('/login', authRateLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const admin = await prisma.adminUser.findUnique({
            where: { username },
        });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, admin.passwordHash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateAdminToken(admin.id);

        res.json({
            token,
            username: admin.username,
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * GET /api/admin/reports
 * List all reports
 */
router.get('/reports', authenticateAdmin, async (req: AuthRequest, res) => {
    try {
        const reports = await prisma.report.findMany({
            select: {
                id: true,
                accessCode: true,
                status: true,
                category: true,
                receivedConfirmationSent: true,
                createdAt: true,
                _count: {
                    select: { messages: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({
            reports: reports.map(report => ({
                id: report.id,
                caseId: report.accessCode,
                status: report.status,
                category: report.category,
                receivedConfirmationSent: report.receivedConfirmationSent,
                createdAt: report.createdAt,
                messageCount: report._count.messages,
            })),
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

/**
 * GET /api/admin/reports/:id
 * Get detailed report with all messages
 */
router.get('/reports/:id', authenticateAdmin, async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;

        const report = await prisma.report.findUnique({
            where: { id },
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
            id: report.id,
            caseId: report.accessCode,
            status: report.status,
            category: report.category,
            receivedConfirmationSent: report.receivedConfirmationSent,
            createdAt: report.createdAt,
            messages: report.messages.map(msg => ({
                id: msg.id,
                senderType: msg.senderType,
                content: msg.content,
                createdAt: msg.createdAt,
                attachments: msg.attachments,
            })),
        });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ error: 'Failed to fetch report' });
    }
});

/**
 * POST /api/admin/reports/:id/messages
 * Send a message as admin to a report
 */
router.post('/reports/:id/messages', authenticateAdmin, upload.array('files', 5), async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return res.status(400).json({ error: 'Message content is required' });
        }

        // Verify report exists
        const report = await prisma.report.findUnique({ where: { id } });
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Update status to IN_PROGRESS if it was NEW
        if (report.status === 'NEW') {
            await prisma.report.update({
                where: { id },
                data: { status: 'IN_PROGRESS' },
            });
        }

        const message = await prisma.message.create({
            data: {
                reportId: id,
                senderType: 'ADMIN',
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

/**
 * PATCH /api/admin/reports/:id/status
 * Update report status
 */
router.patch('/reports/:id/status', authenticateAdmin, async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['NEW', 'IN_PROGRESS', 'CLOSED'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const report = await prisma.report.update({
            where: { id },
            data: { status },
            select: {
                id: true,
                accessCode: true,
                status: true,
            },
        });

        res.json({
            id: report.id,
            caseId: report.accessCode,
            status: report.status,
        });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

/**
 * POST /api/admin/reports/:id/send-confirmation
 * Send acknowledgment of receipt to whistleblower (HinSchG requirement)
 */
router.post('/reports/:id/send-confirmation', authenticateAdmin, async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;

        const report = await prisma.report.findUnique({ where: { id } });
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        if (report.receivedConfirmationSent) {
            return res.status(400).json({ error: 'Confirmation already sent' });
        }

        // Create the standard confirmation message
        const confirmationMessage = `Sehr geehrte/r Hinweisgeber/in,

wir bestätigen hiermit den Eingang Ihres Hinweises vom ${new Date(report.createdAt).toLocaleDateString('de-DE')}.

Ihre Meldung wird nun von unserer internen Meldestelle geprüft. Gemäß den gesetzlichen Vorgaben werden wir Sie innerhalb von drei Monaten über die ergriffenen Maßnahmen informieren.

Vielen Dank für Ihr Vertrauen.

Mit freundlichen Grüßen
Ihre interne Meldestelle`;

        // Create message and update confirmation status
        await prisma.$transaction([
            prisma.message.create({
                data: {
                    reportId: id,
                    senderType: 'ADMIN',
                    content: confirmationMessage,
                },
            }),
            prisma.report.update({
                where: { id },
                data: {
                    receivedConfirmationSent: true,
                    status: report.status === 'NEW' ? 'IN_PROGRESS' : report.status,
                },
            }),
        ]);

        res.json({
            success: true,
            message: 'Eingangsbestätigung wurde gesendet',
        });
    } catch (error) {
        console.error('Error sending confirmation:', error);
        res.status(500).json({ error: 'Failed to send confirmation' });
    }
});

/**
 * GET /api/admin/reports/:id/export-pdf
 * Export case protocol as PDF for legal archiving
 */
router.get('/reports/:id/export-pdf', authenticateAdmin, async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;

        // Import PDF service dynamically to avoid issues if pdfkit not installed
        const { generateReportPdf } = await import('../services/pdf');

        const report = await prisma.report.findUnique({
            where: { id },
            select: { accessCode: true },
        });

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        const pdfBuffer = await generateReportPdf(id);

        const filename = `Protokoll_${report.accessCode}_${new Date().toISOString().split('T')[0]}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error exporting PDF:', error);
        res.status(500).json({ error: 'Failed to export PDF' });
    }
});

export default router;


