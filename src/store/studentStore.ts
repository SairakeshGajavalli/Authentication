import { create } from 'zustand';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, getDoc, setDoc, runTransaction, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Student } from '../types';

interface StudentState {
  students: Student[];
  loading: boolean;
  fetchStudents: () => Promise<void>;
  fetchStudentByEmail: (email: string) => Promise<Student | null>;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
}

export const useStudentStore = create<StudentState>((set) => ({
  students: [],
  loading: false,

  fetchStudents: async () => {
    set({ loading: true });
    try {
      const q = query(collection(db, 'students'));
      const querySnapshot = await getDocs(q);
      const students = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        courses: doc.data().courses || [],
      })) as Student[];
      set({ students });
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchStudentByEmail: async (email: string) => {
    try {
      const q = query(collection(db, 'students'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const studentDoc = querySnapshot.docs[0];
        return {
          id: studentDoc.id,
          ...studentDoc.data(),
          courses: studentDoc.data().courses || [],
        } as Student;
      }
      return null;
    } catch (error) {
      console.error('Error fetching student by email:', error);
      return null;
    }
  },

  addStudent: async (student) => {
    try {
      await runTransaction(db, async (transaction) => {
        const studentWithDefaults = {
          ...student,
          courses: [],
        };
        
        const docRef = await addDoc(collection(db, 'students'), studentWithDefaults);
        transaction.set(doc(db, 'students', docRef.id), {
          ...studentWithDefaults,
          id: docRef.id,
        });
        
        const newStudent = { ...studentWithDefaults, id: docRef.id };
        set(state => ({
          students: [...state.students, newStudent]
        }));
      });
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  },

  updateStudent: async (id, updatedStudent) => {
    try {
      await runTransaction(db, async (transaction) => {
        const studentRef = doc(db, 'students', id);
        const studentDoc = await transaction.get(studentRef);
        
        if (!studentDoc.exists()) {
          throw new Error('Student document does not exist');
        }

        const currentData = studentDoc.data();
        const newData = {
          ...currentData,
          ...updatedStudent,
          courses: updatedStudent.courses || currentData.courses || [],
        };

        transaction.update(studentRef, newData);
        
        set(state => ({
          students: state.students.map(student =>
            student.id === id ? { ...student, ...newData } : student
          )
        }));
      });
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  deleteStudent: async (id) => {
    try {
      await runTransaction(db, async (transaction) => {
        const studentRef = doc(db, 'students', id);
        const studentDoc = await transaction.get(studentRef);
        
        if (!studentDoc.exists()) {
          throw new Error('Student document does not exist');
        }

        const studentData = studentDoc.data();

        // Remove student from all enrolled courses
        if (studentData.courses?.length > 0) {
          for (const courseId of studentData.courses) {
            const courseRef = doc(db, 'courses', courseId);
            const courseDoc = await transaction.get(courseRef);
            if (courseDoc.exists()) {
              const courseData = courseDoc.data();
              transaction.update(courseRef, {
                students: courseData.students.filter((sId: string) => sId !== id)
              });
            }
          }
        }

        transaction.delete(studentRef);
        
        set(state => ({
          students: state.students.filter(student => student.id !== id)
        }));
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },
}));