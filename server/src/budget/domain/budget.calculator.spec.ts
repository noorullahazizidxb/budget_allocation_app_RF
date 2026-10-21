import { exceedsBudget, summarize } from './budget.calculator';

describe('budget calculator', () => {
  const allocs = [
    { id: 'a', amount: 300, spent: 120 },
    { id: 'b', amount: 200, spent: 50.5 },
  ];

  it('summarizes allocations', () => {
    expect(summarize(1000, allocs)).toEqual({
      budget: 1000, allocated: 500, spent: 170.5, unallocated: 500, remaining: 829.5, utilization: 0.1705,
    });
  });

  it('handles zero budget', () => {
    expect(summarize(0, []).utilization).toBe(0);
  });

  it('detects over-allocation for new and existing allocations', () => {
    expect(exceedsBudget(1000, allocs, null, 500)).toBe(false);
    expect(exceedsBudget(1000, allocs, null, 500.01)).toBe(true);
    expect(exceedsBudget(1000, allocs, 'a', 800)).toBe(false);
    expect(exceedsBudget(1000, allocs, 'a', 801)).toBe(true);
  });
});
