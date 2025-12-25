import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // İlk admin kullanıcısını oluştur veya güncelle
  // ⚠️ PRODUCTION'DA MUTLAKA BU ŞİFREYİ DEĞİŞTİRİN!
  // Güvenli şifre: En az 12 karakter, büyük/küçük harf, rakam ve özel karakter içermeli
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'ParisYolcusu2024!Admin';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@parisyolcusu.com' },
    update: {
      // Mevcut kullanıcının şifresini de güncelle
      password: hashedPassword,
      status: 'ACTIVE',
    },
    create: {
      email: 'admin@parisyolcusu.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Admin user created:', admin.email);
  console.log('📧 Email: admin@parisyolcusu.com');
  console.log('🔑 Password:', defaultPassword);
  console.log('⚠️  PRODUCTION\'DA MUTLAKA ŞİFREYİ DEĞİŞTİRİN!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

