import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
          console.log('🌱 Seeding database...');
          const salt = await bcrypt.genSalt(10);

          // 1. Owner Record Insert Karein
          const ownerPassword = await bcrypt.hash('Owner@123', salt);
          const owner = await prisma.user.upsert({
                    where: { email: 'owner@markethub.com' }, // Check karega ke email pehle se hai ya nahi
                    update: {}, // Agar hai tou kuch update nahi karega
                    create: {
                              username: 'System Owner',
                              email: 'owner@markethub.com',
                              password_hash: ownerPassword,
                              role: 'owner',
                              status: 'approved',         // Direct approve
                              is_email_verified: true,    // Email verified
                    },
          });
          console.log(`✅ Owner created: ${owner.email} | Pass: Owner@123`);

          // 2. Admin Record Insert Karein
          const adminPassword = await bcrypt.hash('Admin@123', salt);
          const admin = await prisma.user.upsert({
                    where: { email: 'admin@markethub.com' },
                    update: {},
                    create: {
                              username: 'System Admin',
                              email: 'admin@markethub.com',
                              password_hash: adminPassword,
                              role: 'admin',
                              status: 'approved',         // Direct approve
                              is_email_verified: true,    // Email verified
                    },
          });
          console.log(`✅ Admin created: ${admin.email} | Pass: Admin@123`);
}

main()
          .catch((e) => {
                    console.error('❌ Seeding failed:', e);
                    process.exit(1);
          })
          .finally(async () => {
                    await prisma.$disconnect();
          });