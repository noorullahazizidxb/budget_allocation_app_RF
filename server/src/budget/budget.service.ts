import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BudgetRepository } from './budget.repository';
import { CreateAllocationDto, CreateExpenseDto, UpdateAllocationDto, UpdateBudgetDto } from './budget.schemas';
import { exceedsBudget, summarize } from './domain/budget.calculator';

@Injectable()
export class BudgetService {
  constructor(private readonly repo: BudgetRepository) {}

  async overview(userId: string) {
    const data = await this.repo.loadUserBudget(userId);
    return { ...data, summary: summarize(data.budget, data.allocations) };
  }

  async updateSettings(userId: string, dto: UpdateBudgetDto) {
    if (dto.budget !== undefined) {
      const { allocations } = await this.repo.loadUserBudget(userId);
      const allocated = allocations.reduce((s, a) => s + a.amount, 0);
      if (dto.budget < allocated)
        throw new BadRequestException(`Budget cannot be lower than the allocated total (${allocated})`);
    }
    await this.repo.updateSettings(userId, dto);
    return this.overview(userId);
  }

  async createAllocation(userId: string, dto: CreateAllocationDto) {
    await this.assertWithinBudget(userId, null, dto.amount);
    await this.repo.createAllocation(userId, dto);
    return this.overview(userId);
  }

  async updateAllocation(userId: string, id: string, dto: UpdateAllocationDto) {
    await this.getAllocation(userId, id);
    if (dto.amount !== undefined) await this.assertWithinBudget(userId, id, dto.amount);
    await this.repo.updateAllocation(id, dto);
    return this.overview(userId);
  }

  async deleteAllocation(userId: string, id: string) {
    await this.getAllocation(userId, id);
    await this.repo.deleteAllocation(id);
    return this.overview(userId);
  }

  async addExpense(userId: string, allocationId: string, dto: CreateExpenseDto) {
    await this.getAllocation(userId, allocationId);
    await this.repo.createExpense(allocationId, dto);
    return this.overview(userId);
  }

  recentExpenses(userId: string) {
    return this.repo.recentExpenses(userId);
  }

  async deleteExpense(userId: string, id: string) {
    if (!(await this.repo.findExpense(userId, id))) throw new NotFoundException('Expense not found');
    await this.repo.deleteExpense(id);
    return this.overview(userId);
  }

  private async getAllocation(userId: string, id: string) {
    const a = await this.repo.findAllocation(userId, id);
    if (!a) throw new NotFoundException('Allocation not found');
    return a;
  }

  private async assertWithinBudget(userId: string, id: string | null, amount: number) {
    const { budget, allocations } = await this.repo.loadUserBudget(userId);
    if (exceedsBudget(budget, allocations, id, amount))
      throw new BadRequestException('Allocation exceeds the remaining budget');
  }
}
