import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateAdmin, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/settings
 * Get all system settings (public endpoint for frontend)
 */
router.get('/', async (req, res) => {
    try {
        const settings = await prisma.systemSetting.findMany();

        // Convert array to object for easier frontend usage
        const settingsObj: Record<string, string> = {};
        settings.forEach(s => {
            settingsObj[s.key] = s.value;
        });

        res.json({ settings: settingsObj });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

/**
 * PUT /api/settings
 * Update system settings (admin only)
 */
router.put('/', authenticateAdmin, async (req: AuthRequest, res) => {
    try {
        // Check if current user is super admin
        const currentUser = await prisma.adminUser.findUnique({
            where: { id: req.user!.id },
        });

        if (!currentUser?.isSuper) {
            return res.status(403).json({ error: 'Nur Hauptadministratoren können Einstellungen ändern' });
        }

        const { settings } = req.body;

        if (!settings || typeof settings !== 'object') {
            return res.status(400).json({ error: 'Invalid settings format' });
        }

        // Allowed settings keys
        const allowedKeys = ['COMPANY_NAME', 'WELCOME_TEXT'];

        for (const [key, value] of Object.entries(settings)) {
            if (!allowedKeys.includes(key)) {
                continue; // Skip unknown keys silently
            }

            if (typeof value !== 'string') {
                continue;
            }

            await prisma.systemSetting.upsert({
                where: { key },
                update: { value },
                create: { key, value },
            });
        }

        // Return updated settings
        const updatedSettings = await prisma.systemSetting.findMany();
        const settingsObj: Record<string, string> = {};
        updatedSettings.forEach(s => {
            settingsObj[s.key] = s.value;
        });

        res.json({
            success: true,
            settings: settingsObj,
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

export default router;
