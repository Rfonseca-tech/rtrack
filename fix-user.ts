import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

async function main() {
    const connectionString = process.env.DIRECT_URL;
    if (!connectionString) {
        console.error("DIRECT_URL missing in .env");
        process.exit(1);
    }

    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    console.log("Connected to DB via DIRECT_URL");

    const email = 'suporte@rfonseca.adv.br';

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            console.log(`Found seed user: ${user.id}`);
            await prisma.user.delete({ where: { email } });
            console.log("Deleted seed user successfully.");
        } else {
            console.log("User not found - ready for registration.");
        }
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
