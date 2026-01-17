import PDFDocument from 'pdfkit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ReportPdfData {
    caseId: string;
    status: string;
    createdAt: Date;
    receivedConfirmationSent: boolean;
    messages: Array<{
        senderType: string;
        content: string;
        createdAt: Date;
        attachments: Array<{ originalName: string }>;
    }>;
}

/**
 * Generate a PDF protocol for a report (for legal archiving)
 */
export async function generateReportPdf(reportId: string): Promise<Buffer> {
    // Get the report with all messages
    const report = await prisma.report.findUnique({
        where: { id: reportId },
        include: {
            messages: {
                include: {
                    attachments: {
                        select: { originalName: true },
                    },
                },
                orderBy: { createdAt: 'asc' },
            },
        },
    });

    if (!report) {
        throw new Error('Report not found');
    }

    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        const doc = new PDFDocument({ margin: 50 });

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Title
        doc.fontSize(20).font('Helvetica-Bold').text('Fallprotokoll / Hinweisgebersystem', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).font('Helvetica').text(`Generiert am: ${new Date().toLocaleString('de-DE')}`, { align: 'center' });
        doc.moveDown(2);

        // Case Info
        doc.fontSize(12).font('Helvetica-Bold').text('Fallübersicht');
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica');

        const statusLabels: Record<string, string> = {
            'NEW': 'Neu',
            'IN_PROGRESS': 'In Bearbeitung',
            'CLOSED': 'Abgeschlossen',
        };

        doc.text(`Zugriffsschlüssel: ${report.accessCode}`);
        doc.text(`Status: ${statusLabels[report.status] || report.status}`);
        doc.text(`Eingangsdatum: ${report.createdAt.toLocaleString('de-DE')}`);
        doc.text(`Eingangsbestätigung versendet: ${report.receivedConfirmationSent ? 'Ja' : 'Nein'}`);
        doc.moveDown(2);

        // Messages
        doc.fontSize(12).font('Helvetica-Bold').text('Kommunikationsverlauf');
        doc.moveDown(0.5);

        report.messages.forEach((msg, index) => {
            const sender = msg.senderType === 'WHISTLEBLOWER' ? 'Hinweisgeber/in' : 'Meldestelle';
            const date = msg.createdAt.toLocaleString('de-DE');

            doc.fontSize(10).font('Helvetica-Bold').text(`[${index + 1}] ${sender} - ${date}`);
            doc.fontSize(10).font('Helvetica').text(msg.content, { indent: 20 });

            if (msg.attachments.length > 0) {
                doc.moveDown(0.3);
                doc.fontSize(9).font('Helvetica-Oblique').text('Anlagen:', { indent: 20 });
                msg.attachments.forEach((att) => {
                    doc.text(`• ${att.originalName}`, { indent: 30 });
                });
            }

            doc.moveDown();
        });

        // Footer notice
        doc.moveDown(2);
        doc.fontSize(8).font('Helvetica').text('---');
        doc.text('Dieses Dokument wurde automatisch generiert und dient der rechtssicheren Dokumentation gemäß HinSchG.');
        doc.text('Alle Zeitangaben in mitteleuropäischer Zeit (MEZ/MESZ).');

        doc.end();
    });
}
