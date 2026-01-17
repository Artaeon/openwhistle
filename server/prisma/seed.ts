import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const adminUsername = 'admin';
    const adminPassword = process.env.ADMIN_INIT_PASSWORD || 'admin123';

    const existingAdmin = await prisma.adminUser.findUnique({
        where: { username: adminUsername },
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 12);
        await prisma.adminUser.create({
            data: {
                username: adminUsername,
                passwordHash: hashedPassword,
                isSuper: true,
            },
        });
        console.log(`Admin user '${adminUsername}' created`);
    } else {
        console.log('Admin user already exists');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
