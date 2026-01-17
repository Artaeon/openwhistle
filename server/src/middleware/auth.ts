import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface AuthRequest extends Request {
    userId?: string;
    userType?: 'admin' | 'whistleblower';
    reportId?: string;
    user?: { id: string }; // Added for route compatibility
}

/**
 * Middleware to verify admin JWT tokens
 */
export function authenticateAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as { userId: string; type: string };

        if (decoded.type !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        req.userId = decoded.userId;
        req.user = { id: decoded.userId }; // Set user object for compatibility
        req.userType = 'admin';
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

/**
 * Middleware to verify whistleblower JWT tokens
 */
export function authenticateWhistleblower(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as { reportId: string; type: string };

        if (decoded.type !== 'whistleblower') {
            return res.status(403).json({ error: 'Whistleblower access required' });
        }

        req.reportId = decoded.reportId;
        req.userType = 'whistleblower';
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

/**
 * Generate JWT for admin users
 */
export function generateAdminToken(userId: string): string {
    return jwt.sign({ userId, type: 'admin' }, config.jwtSecret, { expiresIn: '24h' });
}

/**
 * Generate JWT for whistleblowers
 */
export function generateWhistleblowerToken(reportId: string): string {
    return jwt.sign({ reportId, type: 'whistleblower' }, config.jwtSecret, { expiresIn: '24h' });
}
