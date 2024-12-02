import { create } from 'zustand';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Professor } from '../types';

interface ProfessorState {
  professors: Professor[];
  loading: boolean;
  fetchProfessors: () => Promise<void>;
  addProfessor: (professor: Omit<Professor, 'id'>) => Promise<void>;
  updateProfessor: (id: string, professor: Partial<Professor>) => Promise<void>;
  deleteProfessor: (id: string) => Promise<void>;
}

export const useProfessorStore = create<ProfessorState>((set, get) => ({
  professors: [],
  loading: false,

  fetchProfessors: async () => {
    set({ loading: true });
    try {
      const q = query(collection(db, 'professors'));
      const querySnapshot = await getDocs(q);
      const professors = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Professor[];
      set({ professors });
    } catch (error) {
      console.error('Error fetching professors:', error);
    } finally {
      set({ loading: false });
    }
  },

  addProfessor: async (professor) => {
    try {
      const docRef = await addDoc(collection(db, 'professors'), professor);
      const newProfessor = { ...professor, id: docRef.id };
      set(state => ({
        professors: [...state.professors, newProfessor]
      }));
    } catch (error) {
      console.error('Error adding professor:', error);
      throw error;
    }
  },

  updateProfessor: async (id, updatedProfessor) => {
    try {
      const docRef = doc(db, 'professors', id);
      await updateDoc(docRef, updatedProfessor);
      set(state => ({
        professors: state.professors.map(professor =>
          professor.id === id ? { ...professor, ...updatedProfessor } : professor
        )
      }));
    } catch (error) {
      console.error('Error updating professor:', error);
      throw error;
    }
  },

  deleteProfessor: async (id) => {
    try {
      await deleteDoc(doc(db, 'professors', id));
      set(state => ({
        professors: state.professors.filter(professor => professor.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting professor:', error);
      throw error;
    }
  }
}));