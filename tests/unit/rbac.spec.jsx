import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import App from '@/App'; // Using App to test ProtectedRoute in context

// Mock the context
vi.mock('@/contexts/SupabaseAuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock child components to isolate the test
vi.mock('@/pages/DashboardPage', () => ({ default: () => <div>Dashboard Page</div> }));
vi.mock('@/pages/AuthPage', () => ({ default: () => <div>Login Page</div> }));
vi.mock('@/pages/admin/AdminDashboardPage', () => ({ default: () => <div>Admin Page</div> }));

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: MemoryRouter });
};

describe('ProtectedRoute RBAC', () => {
  it('redirects to login if user is not authenticated', () => {
    useAuth.mockReturnValue({ user: null, profile: null, loading: false });
    renderWithRouter(<App />, { route: '/dashboard' });
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('allows access to protected route if user is authenticated', () => {
    useAuth.mockReturnValue({ user: { id: '123' }, profile: { roles: { name: 'User' } }, loading: false });
    renderWithRouter(<App />, { route: '/dashboard' });
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });

  it('redirects non-admin from admin route', () => {
    useAuth.mockReturnValue({ user: { id: '123' }, profile: { roles: { name: 'User' } }, loading: false });
    renderWithRouter(<App />, { route: '/admin' });
    // Should be redirected to dashboard
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });

  it('allows admin access to admin route', () => {
    useAuth.mockReturnValue({ user: { id: '123' }, profile: { roles: { name: 'Admin' } }, loading: false });
    renderWithRouter(<App />, { route: '/admin' });
    expect(screen.getByText('Admin Page')).toBeInTheDocument();
  });

  it('allows super admin access to admin route', () => {
    useAuth.mockReturnValue({ user: { id: '123' }, profile: { roles: { name: 'Super Admin' } }, loading: false });
    renderWithRouter(<App />, { route: '/admin' });
    expect(screen.getByText('Admin Page')).toBeInTheDocument();
  });
});