import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Finding first coach...");
    const firstCoach = await prisma.profiles.findFirst({ where: { role: 'coach' } });
    console.log("First coach is:", firstCoach);

    if (firstCoach) {
        console.log("Creating lead with coach id...");
        const lead = await prisma.leads.create({
            data: {
                full_name: "Test User 3",
                email: "test3@example.com",
                goal: "Fit",
                coach_id: firstCoach.id
            }
        });
        console.log("Success! Created lead:", lead.id);
    } else {
        console.log("No coach found!");
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
