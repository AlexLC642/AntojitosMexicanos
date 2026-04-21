import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (!process.env.PRISMA_DATABASE_URL && process.env.NODE_ENV === 'production') {
  console.warn('Advertencia: PRISMA_DATABASE_URL no encontrada durante el build.');
}

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
