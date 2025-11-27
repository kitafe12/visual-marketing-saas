import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = (() => {
    let prismaInstance: PrismaClient;
    try {
        prismaInstance = globalForPrisma.prisma || new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });
    } catch (e) {
        console.error('Failed to instantiate PrismaClient:', e);
        // Fallback only for build time
        prismaInstance = {} as unknown as PrismaClient;
    }
    return prismaInstance;
})();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
