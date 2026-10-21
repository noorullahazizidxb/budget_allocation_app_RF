import { BadRequestException } from '@nestjs/common';
import { BudgetService } from './budget.service';

describe('BudgetService', () => {
  const state = { budget: 1000, currency: 'USD', allocations: [{ id: 'a', name: 'IT', amount: 600, color: '#000000', spent: 0 }] };
  const repo = {
    loadUserBudget: jest.fn().mockResolvedValue(state),
    createAllocation: jest.fn(),
    updateSettings: jest.fn(),
  };
  const service = new BudgetService(repo as never);

  it('rejects allocations over budget', async () => {
    await expect(service.createAllocation('u', { name: 'X', amount: 500, color: '#111111' })).rejects.toBeInstanceOf(BadRequestException);
    expect(repo.createAllocation).not.toHaveBeenCalled();
  });

  it('creates allocations within budget', async () => {
    await service.createAllocation('u', { name: 'X', amount: 400, color: '#111111' });
    expect(repo.createAllocation).toHaveBeenCalled();
  });

  it('refuses to lower budget below allocated total', async () => {
    await expect(service.updateSettings('u', { budget: 100 })).rejects.toBeInstanceOf(BadRequestException);
  });
});
