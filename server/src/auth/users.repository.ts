import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export const DEFAULT_CATEGORIES = [
  { name: 'Marketing', color: '#3b82f6' },
  { name: 'Finance', color: '#f97316' },
  { name: 'Sales', color: '#10b981' },
  { name: 'Human Resources', color: '#a855f7' },
  { name: 'IT', color: '#ef4444' },
];

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({ where: { googleId } });
  }

  linkGoogle(id: string, googleId: string) {
    return this.prisma.user.update({ where: { id }, data: { googleId } });
  }

  create(data: { name: string; email: string; passwordHash?: string | null; googleId?: string }) {
    return this.prisma.user.create({
      data: { ...data, allocations: { create: DEFAULT_CATEGORIES } },
    });
  }
}
