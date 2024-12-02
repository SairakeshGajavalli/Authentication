import { create } from 'zustand';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, role: 'admin' | 'professor' | 'student') => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email, password, role) => {
    set({ loading: true, error: null });
    try {
      let collection_name = '';
      switch (role) {
        case 'professor':
          collection_name = 'professors';
          break;
        case 'student':
          collection_name = 'students';
          break;
        case 'admin':
          // For demo, allow any email for admin
          set({
            user: {
              id: 'admin',
              name: 'Administrator',
              email,
              role: 'admin'
            },
            loading: false
          });
          return;
      }

      if (collection_name) {
        const q = query(
          collection(db, collection_name),
          where('email', '==', email)
        );
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          set({
            user: {
              id: querySnapshot.docs[0].id,
              name: userData.name,
              email: userData.email,
              role
            },
            loading: false
          });
        } else {
          set({ error: 'User not found', loading: false });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      set({ error: 'Login failed', loading: false });
    }
  },

  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));