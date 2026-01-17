import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/env';

const prisma = new PrismaClient();

// Create transporter only if SMTP is configured
const transporter = config.smtp.enabled
    ? nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure,
        auth: {
            user: config.smtp.user,
            pass: config.smtp.pass,
        },
    })
    : null;

/**
 * Send notification to all admin users about a new report
 * Note: Email content is deliberately minimal for security
 */
export async function notifyAdminsNewReport(caseId: string): Promise<void> {
    if (!transporter) {
        console.log('Email notifications disabled (SMTP not configured)');
        return;
    }

    try {
        // Get all admin users with email addresses
        const admins = await prisma.adminUser.findMany({
            where: {
                email: { not: null },
            },
            select: { email: true },
        });

        if (admins.length === 0) {
            console.log('No admin users with email addresses found');
            return;
        }

        const emailAddresses = admins.map(a => a.email).filter(Boolean) as string[];

        const mailOptions = {
            from: config.smtp.from,
            to: emailAddresses.join(', '),
            subject: `Neuer Hinweis eingegangen (${caseId})`,
            text: `Ein neuer Hinweis (ID: ${caseId}) wurde eingegangen.

Bitte loggen Sie sich unter ${config.appUrl}/admin ein, um den Fall zu bearbeiten.

--
Diese E-Mail wurde automatisch von Ihrer internen Meldestelle versendet.
Der Inhalt der Meldung ist aus Sicherheitsgründen nicht in dieser E-Mail enthalten.`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e3a5f; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #1e3a5f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .footer { padding: 20px; font-size: 12px; color: #666; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Interne Meldestelle</h1>
        </div>
        <div class="content">
            <h2>Neuer Hinweis eingegangen</h2>
            <p>Ein neuer Hinweis mit der ID <strong>${caseId}</strong> wurde eingegangen.</p>
            <p>Bitte loggen Sie sich im Meldestellen-Portal ein, um den Fall zu bearbeiten:</p>
            <a href="${config.appUrl}/admin" class="button">Zum Portal</a>
            <p><em>Der Inhalt der Meldung ist aus Sicherheitsgründen nicht in dieser E-Mail enthalten.</em></p>
        </div>
        <div class="footer">
            Diese E-Mail wurde automatisch von Ihrer internen Meldestelle versendet.
        </div>
    </div>
</body>
</html>`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email notification sent to ${emailAddresses.length} admin(s)`);
    } catch (error) {
        console.error('Failed to send email notification:', error);
        // Don't throw - email failure shouldn't break report submission
    }
}
