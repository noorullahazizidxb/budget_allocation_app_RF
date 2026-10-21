import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '@/App';
import { signUpSchema } from '@/features/auth/auth.schemas';
import { budgetSettingsSchema } from '@/features/budget/budget.schemas';

const renderAt = (path: string) => render(<MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter>);

describe('auth pages', () => {
  it('redirects guests to sign-in and shows the logo', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getAllByAltText(/budget manager by devminds/i).length).toBeGreaterThan(0);
  });

  it('validates sign-in fields with zod', async () => {
    renderAt('/sign-in');
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('renders sign-up page', () => {
    renderAt('/sign-up');
    expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument();
  });
});

describe('schemas', () => {
  it('sign-up requires matching passwords', () => {
    const r = signUpSchema.safeParse({ name: 'Jo', email: 'a@b.co', password: 'abc12345', confirmPassword: 'x' });
    expect(r.success).toBe(false);
  });
  it('yup budget settings rejects negatives', () => {
    expect(budgetSettingsSchema.isValidSync({ budget: -1, currency: 'USD' })).toBe(false);
    expect(budgetSettingsSchema.isValidSync({ budget: 100, currency: 'USD' })).toBe(true);
  });
});
