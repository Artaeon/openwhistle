import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { authenticateAdmin, authenticateWhistleblower, AuthRequest } from '../middleware/auth';
import { config } from '../config/env';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/attachments/:id
 * Download an attachment (authenticated users only)
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Verify token and get user type
        const jwt = require('jsonwebtoken');
        let decoded: any;

        try {
            decoded = jwt.verify(authHeader.substring(7), config.jwtSecret);
        } catch {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const { id } = req.params;

        const attachment = await prisma.attachment.findUnique({
            where: { id },
            include: {
                message: {
                    include: {
                        report: true,
                    },
                },
            },
        });

        if (!attachment) {
            return res.status(404).json({ error: 'Attachment not found' });
        }

        // Verify access rights
        if (decoded.type === 'whistleblower') {
            if (attachment.message.report.id !== decoded.reportId) {
                return res.status(403).json({ error: 'Access denied' });
            }
        }
        // Admins can access all attachments

        const filePath = path.join(config.uploadsDir, attachment.filePath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.download(filePath, attachment.originalName);
    } catch (error) {
        console.error('Error downloading attachment:', error);
        res.status(500).json({ error: 'Failed to download attachment' });
    }
});

export default router;
