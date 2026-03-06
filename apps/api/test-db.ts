import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Adding columns...");
    try {
        await prisma.$executeRawUnsafe(`ALTER TABLE profiles ADD COLUMN weekly_goal INTEGER DEFAULT 3`);
        console.log("Added weekly_goal");
    } catch (e) { console.log(e.message) }

    try {
        await prisma.$executeRawUnsafe(`ALTER TABLE profiles ADD COLUMN push_subscription JSONB`);
        console.log("Added push_subscription");
    } catch (e) { console.log(e.message) }

    console.log("Done adding columns");

    const profiles = await prisma.profiles.findMany();
    console.log("\nPROFILES:");
    console.dir(profiles.map(p => ({ id: p.id, role: p.role, email: p.email })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
