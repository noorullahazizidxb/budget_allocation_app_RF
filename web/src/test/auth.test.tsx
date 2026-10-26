import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '@/App';
import { signUpSchema } from '@/features/auth/auth.schemas';
import { budgetSettingsSchema } from '@/features/budget/budget.schemas';

const renderAt = (path: string) => render(<HelmetProvider><MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter></HelmetProvider>);

describe('auth pages', () => {
  it('shows guests the public landing page with sign-in links', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1, name: /free budget planner and budget manager/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /sign in/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByAltText(/budget manager by devminds/i).length).toBeGreaterThan(0);
  });

  it('shows the sign-in page and logo', () => {
    renderAt('/sign-in');
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
