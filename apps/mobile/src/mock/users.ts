import type { User } from '@m2/types';

export const MOCK_AGENT: User = {
  id: 'user-001',
  name: 'Carlos Mendoza',
  email: 'carlos.mendoza@motomoto.mx',
  role: 'agent',
  status: 'online',
  createdAt: '2024-01-15T08:00:00.000Z',
  updatedAt: '2025-03-17T10:00:00.000Z',
};

export const MOCK_MANAGER: User = {
  id: 'user-002',
  name: 'Ana García',
  email: 'ana.garcia@motomoto.mx',
  role: 'manager',
  status: 'online',
  createdAt: '2023-06-01T08:00:00.000Z',
  updatedAt: '2025-03-17T09:30:00.000Z',
};

export const MOCK_ADMIN: User = {
  id: 'user-003',
  name: 'Roberto Hernández',
  email: 'roberto.hernandez@motomoto.mx',
  role: 'admin',
  status: 'away',
  createdAt: '2023-01-10T08:00:00.000Z',
  updatedAt: '2025-03-17T08:00:00.000Z',
};

/** Default current user for development — manager role enables all role-gated screens. */
export const MOCK_CURRENT_USER: User = MOCK_MANAGER;
