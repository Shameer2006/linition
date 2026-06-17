import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting migration...');
  
  // Find all projects that don't have members yet
  const projects = await prisma.project.findMany({
    include: {
      members: true,
    },
  });

  console.log(`Found ${projects.length} projects`);

  for (const project of projects) {
    if (project.members.length === 0) {
      console.log(`Migrating project ${project.id} (${project.name})...`);
      
      await prisma.projectMember.create({
        data: {
          projectId: project.id,
          userId: project.userId, // use the original creator as OWNER
          role: 'OWNER',
        },
      });
      
      console.log(`Added OWNER member for project ${project.id}`);
    }
  }

  console.log('Migration complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
