import type { PrismaService } from 'src/prisma/prisma.service';

export async function clearDatabase(prisma: PrismaService) {
  await prisma.lend.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.bundle.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}
