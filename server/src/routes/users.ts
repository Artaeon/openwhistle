import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { authenticateAdmin, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/admin/users
 * List all admin users (only accessible by super admin)
 */
router.get('/', authenticateAdmin, async (req: AuthRequest, res) => {
    try {
        // Check if current user is super admin
        const currentUser = await prisma.adminUser.findUnique({
            where: { id: req.user!.id },
        });

        if (!currentUser?.isSuper) {
            return res.status(403).json({ error: 'Nur Hauptadministratoren können Benutzer verwalten' });
        }

        const users = await prisma.adminUser.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                isSuper: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
        });

        res.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Benutzer konnten nicht geladen werden' });
    }
});

/**
 * POST /api/admin/users
 * Create a new admin user
 */
router.post('/', authenticateAdmin, async (req: AuthRequest, res) => {
    try {
        const currentUser = await prisma.adminUser.findUnique({
            where: { id: req.user!.id },
        });

        if (!currentUser?.isSuper) {
            return res.status(403).json({ error: 'Nur Hauptadministratoren können Benutzer erstellen' });
        }

        const { username, email, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Benutzername und Passwort sind erforderlich' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Passwort muss mindestens 8 Zeichen lang sein' });
        }

        // Check for existing username
        const existingUser = await prisma.adminUser.findFirst({
            where: {
                OR: [
                    { username },
                    ...(email ? [{ email }] : []),
                ],
            },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Benutzername oder E-Mail bereits vergeben' });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prisma.adminUser.create({
            data: {
                username,
                email: email || null,
                passwordHash,
                isSuper: false,
            },
            select: {
                id: true,
                username: true,
                email: true,
                isSuper: true,
                createdAt: true,
            },
        });

        res.status(201).json({ user });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Benutzer konnte nicht erstellt werden' });
    }
});

/**
 * DELETE /api/admin/users/:id
 * Delete an admin user
 */
router.delete('/:id', authenticateAdmin, async (req: AuthRequest, res) => {
    try {
        const currentUser = await prisma.adminUser.findUnique({
            where: { id: req.user!.id },
        });

        if (!currentUser?.isSuper) {
            return res.status(403).json({ error: 'Nur Hauptadministratoren können Benutzer löschen' });
        }

        const { id } = req.params;

        // Cannot delete yourself
        if (id === req.user!.id) {
            return res.status(400).json({ error: 'Sie können sich nicht selbst löschen' });
        }

        // Cannot delete another super admin
        const targetUser = await prisma.adminUser.findUnique({ where: { id } });
        if (targetUser?.isSuper) {
            return res.status(400).json({ error: 'Hauptadministratoren können nicht gelöscht werden' });
        }

        await prisma.adminUser.delete({ where: { id } });

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Benutzer konnte nicht gelöscht werden' });
    }
});

export default router;
