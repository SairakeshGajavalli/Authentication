import { db } from '../lib/firebase';
import { doc, runTransaction } from 'firebase/firestore';
import type { Course, Student, Professor } from '../types';

export async function updateCourseAndStudents(
  courseId: string,
  studentId: string,
  isAssigning: boolean
) {
  try {
    await runTransaction(db, async (transaction) => {
      const courseRef = doc(db, 'courses', courseId);
      const studentRef = doc(db, 'students', studentId);

      const courseDoc = await transaction.get(courseRef);
      const studentDoc = await transaction.get(studentRef);

      if (!courseDoc.exists() || !studentDoc.exists()) {
        throw new Error('Document does not exist!');
      }

      const courseData = courseDoc.data() as Course;
      const studentData = studentDoc.data() as Student;

      if (isAssigning) {
        // Add student to course
        const updatedStudents = [...new Set([...courseData.students, studentId])];
        transaction.update(courseRef, { students: updatedStudents });

        // Add course to student
        const updatedCourses = [...new Set([...studentData.courses, courseId])];
        transaction.update(studentRef, { courses: updatedCourses });
      } else {
        // Remove student from course
        const updatedStudents = courseData.students.filter(id => id !== studentId);
        transaction.update(courseRef, { students: updatedStudents });

        // Remove course from student
        const updatedCourses = studentData.courses.filter(id => id !== courseId);
        transaction.update(studentRef, { courses: updatedCourses });
      }
    });
  } catch (error) {
    console.error('Error in transaction:', error);
    throw error;
  }
}

export async function updateCourseAndProfessor(
  courseId: string,
  professorId: string,
  isAssigning: boolean
) {
  try {
    await runTransaction(db, async (transaction) => {
      const courseRef = doc(db, 'courses', courseId);
      const professorRef = doc(db, 'professors', professorId);

      const courseDoc = await transaction.get(courseRef);
      const professorDoc = await transaction.get(professorRef);

      if (!courseDoc.exists() || !professorDoc.exists()) {
        throw new Error('Document does not exist!');
      }

      const courseData = courseDoc.data() as Course;
      const professorData = professorDoc.data() as Professor;

      if (isAssigning) {
        // Update professor's courses
        const updatedCourses = [...new Set([...professorData.courses, courseId])];
        transaction.update(professorRef, { courses: updatedCourses });

        // Update course's professor
        transaction.update(courseRef, { professorId });
      } else {
        // Remove course from professor
        const updatedCourses = professorData.courses.filter(id => id !== courseId);
        transaction.update(professorRef, { courses: updatedCourses });

        // Remove professor from course
        transaction.update(courseRef, { professorId: '' });
      }
    });
  } catch (error) {
    console.error('Error in transaction:', error);
    throw error;
  }
}