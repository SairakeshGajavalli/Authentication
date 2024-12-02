import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query,
  runTransaction,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Course } from '../types';

interface CourseState {
  courses: Course[];
  loading: boolean;
  fetchCourses: () => Promise<void>;
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  assignStudent: (courseId: string, studentId: string) => Promise<void>;
  unassignStudent: (courseId: string, studentId: string) => Promise<void>;
  assignProfessor: (courseId: string, professorId: string) => Promise<void>;
  unassignProfessor: (courseId: string) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  loading: false,

  fetchCourses: async () => {
    set({ loading: true });
    try {
      const q = query(collection(db, 'courses'));
      const querySnapshot = await getDocs(q);
      const courses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        students: doc.data().students || [],
        professorId: doc.data().professorId || '',
      })) as Course[];
      set({ courses });
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      set({ loading: false });
    }
  },

  addCourse: async (course) => {
    try {
      const courseWithDefaults = {
        ...course,
        students: [],
        professorId: '',
      };
      
      await runTransaction(db, async (transaction) => {
        const docRef = await addDoc(collection(db, 'courses'), courseWithDefaults);
        transaction.set(doc(db, 'courses', docRef.id), { 
          ...courseWithDefaults, 
          id: docRef.id 
        });
        
        const newCourse = { ...courseWithDefaults, id: docRef.id };
        set(state => ({
          courses: [...state.courses, newCourse]
        }));
      });
    } catch (error) {
      console.error('Error adding course:', error);
      throw error;
    }
  },

  updateCourse: async (id, updatedCourse) => {
    try {
      await runTransaction(db, async (transaction) => {
        const courseRef = doc(db, 'courses', id);
        const courseDoc = await transaction.get(courseRef);
        
        if (!courseDoc.exists()) {
          throw new Error('Course document does not exist');
        }

        const currentData = courseDoc.data();
        const newData = {
          ...currentData,
          ...updatedCourse,
          students: updatedCourse.students || currentData.students || [],
          professorId: updatedCourse.professorId || currentData.professorId || '',
        };

        transaction.update(courseRef, newData);
        
        set(state => ({
          courses: state.courses.map(course =>
            course.id === id ? { ...course, ...newData } : course
          )
        }));
      });
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  deleteCourse: async (id) => {
    try {
      await runTransaction(db, async (transaction) => {
        const courseRef = doc(db, 'courses', id);
        const courseDoc = await transaction.get(courseRef);
        
        if (!courseDoc.exists()) {
          throw new Error('Course document does not exist');
        }

        const courseData = courseDoc.data();

        // Remove course from all enrolled students
        if (courseData.students?.length > 0) {
          for (const studentId of courseData.students) {
            const studentRef = doc(db, 'students', studentId);
            const studentDoc = await transaction.get(studentRef);
            if (studentDoc.exists()) {
              const studentData = studentDoc.data();
              transaction.update(studentRef, {
                courses: (studentData.courses || []).filter((cId: string) => cId !== id)
              });
            }
          }
        }

        // Remove course from professor if assigned
        if (courseData.professorId) {
          const professorRef = doc(db, 'professors', courseData.professorId);
          const professorDoc = await transaction.get(professorRef);
          if (professorDoc.exists()) {
            const professorData = professorDoc.data();
            transaction.update(professorRef, {
              courses: (professorData.courses || []).filter((cId: string) => cId !== id)
            });
          }
        }

        transaction.delete(courseRef);
        
        set(state => ({
          courses: state.courses.filter(course => course.id !== id)
        }));
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  assignStudent: async (courseId, studentId) => {
    try {
      await runTransaction(db, async (transaction) => {
        const courseRef = doc(db, 'courses', courseId);
        const studentRef = doc(db, 'students', studentId);
        
        const [courseDoc, studentDoc] = await Promise.all([
          transaction.get(courseRef),
          transaction.get(studentRef)
        ]);
        
        if (!courseDoc.exists() || !studentDoc.exists()) {
          throw new Error('Document does not exist');
        }

        const courseData = courseDoc.data();
        const studentData = studentDoc.data();

        // Update course's students array
        const updatedCourseStudents = [...new Set([...courseData.students || [], studentId])];
        transaction.update(courseRef, { students: updatedCourseStudents });

        // Update student's courses array
        const updatedStudentCourses = [...new Set([...studentData.courses || [], courseId])];
        transaction.update(studentRef, { courses: updatedStudentCourses });

        // Update local state
        set(state => ({
          courses: state.courses.map(course =>
            course.id === courseId
              ? { ...course, students: updatedCourseStudents }
              : course
          )
        }));
      });
    } catch (error) {
      console.error('Error assigning student:', error);
      throw error;
    }
  },

  unassignStudent: async (courseId, studentId) => {
    try {
      await runTransaction(db, async (transaction) => {
        const courseRef = doc(db, 'courses', courseId);
        const studentRef = doc(db, 'students', studentId);
        
        const [courseDoc, studentDoc] = await Promise.all([
          transaction.get(courseRef),
          transaction.get(studentRef)
        ]);
        
        if (!courseDoc.exists() || !studentDoc.exists()) {
          throw new Error('Document does not exist');
        }

        const courseData = courseDoc.data();
        const studentData = studentDoc.data();

        // Update course's students array
        const updatedCourseStudents = (courseData.students || []).filter(id => id !== studentId);
        transaction.update(courseRef, { students: updatedCourseStudents });

        // Update student's courses array
        const updatedStudentCourses = (studentData.courses || []).filter(id => id !== courseId);
        transaction.update(studentRef, { courses: updatedStudentCourses });

        // Update local state
        set(state => ({
          courses: state.courses.map(course =>
            course.id === courseId
              ? { ...course, students: updatedCourseStudents }
              : course
          )
        }));
      });
    } catch (error) {
      console.error('Error unassigning student:', error);
      throw error;
    }
  },

  assignProfessor: async (courseId, professorId) => {
    try {
      await runTransaction(db, async (transaction) => {
        const courseRef = doc(db, 'courses', courseId);
        const professorRef = doc(db, 'professors', professorId);
        
        const [courseDoc, professorDoc] = await Promise.all([
          transaction.get(courseRef),
          transaction.get(professorRef)
        ]);
        
        if (!courseDoc.exists() || !professorDoc.exists()) {
          throw new Error('Document does not exist');
        }

        const professorData = professorDoc.data();

        // Update course's professor
        transaction.update(courseRef, { professorId });

        // Update professor's courses array
        const updatedProfessorCourses = [...new Set([...professorData.courses || [], courseId])];
        transaction.update(professorRef, { courses: updatedProfessorCourses });

        // Update local state
        set(state => ({
          courses: state.courses.map(course =>
            course.id === courseId
              ? { ...course, professorId }
              : course
          )
        }));
      });
    } catch (error) {
      console.error('Error assigning professor:', error);
      throw error;
    }
  },

  unassignProfessor: async (courseId) => {
    try {
      await runTransaction(db, async (transaction) => {
        const courseRef = doc(db, 'courses', courseId);
        const courseDoc = await transaction.get(courseRef);
        
        if (!courseDoc.exists()) {
          throw new Error('Course document does not exist');
        }

        const courseData = courseDoc.data();
        
        if (courseData.professorId) {
          const professorRef = doc(db, 'professors', courseData.professorId);
          const professorDoc = await transaction.get(professorRef);
          
          if (professorDoc.exists()) {
            const professorData = professorDoc.data();
            // Update professor's courses array
            const updatedProfessorCourses = (professorData.courses || []).filter(id => id !== courseId);
            transaction.update(professorRef, { courses: updatedProfessorCourses });
          }
        }

        // Remove professor from course
        transaction.update(courseRef, { professorId: '' });

        // Update local state
        set(state => ({
          courses: state.courses.map(course =>
            course.id === courseId
              ? { ...course, professorId: '' }
              : course
          )
        }));
      });
    } catch (error) {
      console.error('Error unassigning professor:', error);
      throw error;
    }
  },
}));