import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAllocationDto, CreateExpenseDto, UpdateAllocationDto } from './budget.schemas';

@Injectable()
export class BudgetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async loadUserBudget(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        budget: true, currency: true,
        allocations: { orderBy: { createdAt: 'asc' }, include: { expenses: { select: { amount: true } } } },
      },
    });
    return {
      budget: user.budget,
      currency: user.currency,
      allocations: user.allocations.map(({ expenses, ...a }) => ({
        id: a.id, name: a.name, amount: a.amount, color: a.color,
        spent: expenses.reduce((s, e) => s + e.amount, 0),
      })),
    };
  }

  updateSettings(userId: string, data: { budget?: number; currency?: string }) {
    return this.prisma.user.update({ where: { id: userId }, data });
  }

  findAllocation(userId: string, id: string) {
    return this.prisma.allocation.findFirst({ where: { id, userId } });
  }

  createAllocation(userId: string, dto: CreateAllocationDto) {
    return this.prisma.allocation.create({ data: { ...dto, userId } });
  }

  updateAllocation(id: string, dto: UpdateAllocationDto) {
    return this.prisma.allocation.update({ where: { id }, data: dto });
  }

  deleteAllocation(id: string) {
    return this.prisma.allocation.delete({ where: { id } });
  }

  createExpense(allocationId: string, dto: CreateExpenseDto) {
    return this.prisma.expense.create({ data: { ...dto, allocationId } });
  }

  recentExpenses(userId: string, take = 20) {
    return this.prisma.expense.findMany({
      where: { allocation: { userId } },
      orderBy: { spentAt: 'desc' },
      take,
      include: { allocation: { select: { name: true, color: true } } },
    });
  }

  findExpense(userId: string, id: string) {
    return this.prisma.expense.findFirst({ where: { id, allocation: { userId } } });
  }

  deleteExpense(id: string) {
    return this.prisma.expense.delete({ where: { id } });
  }
}
