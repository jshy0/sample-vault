import { prisma } from "../../db";

export const AuthRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
      select: { id: true, email: true, username: true, createdAt: true },
    });
  },

  async create(email: string, username: string, passwordHash: string) {
    return prisma.user.create({
      data: { email, username, passwordHash },
      select: { id: true, email: true, username: true, createdAt: true },
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, username: true, createdAt: true, credits: true },
    });
  },
};
