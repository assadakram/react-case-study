import { create } from 'zustand';
import { UserRole } from '../types';

interface UserStore {
  name: string;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  name: 'Alice',
  role: 'admin',
  setRole: (role: UserRole) => set({ role }),
}));