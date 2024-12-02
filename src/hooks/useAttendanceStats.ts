import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { useCourseStore } from '../store/courseStore';
import { useProfessorStore } from '../store/professorStore';

interface AttendanceStats {
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
  attendancePercentage: number;
}

export function useAttendanceStats() {
  const { user } = useAuthStore();
  const { courses } = useCourseStore();
  const { professors } = useProfessorStore();
  const [stats, setStats] = useState<AttendanceStats>({
    totalStudents: 0,
    presentStudents: 0,
    absentStudents: 0,
    attendancePercentage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceStats = async () => {
      try {
        const professor = professors.find(p => p.email === user?.email);
        if (!professor) return;

        const professorCourses = courses.filter(course => 
          professor.courses.includes(course.id)
        );

        let totalStudents = 0;
        let presentStudents = 0;

        professorCourses.forEach(course => {
          totalStudents += course.students.length;
        });

        const attendanceRecords = [];
        for (const course of professorCourses) {
          const q = query(
            collection(db, 'attendance'),
            where('courseId', '==', course.id)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(doc => {
            attendanceRecords.push(doc.data());
          });
        }

        presentStudents = attendanceRecords.length;
        const absentStudents = totalStudents - presentStudents;
        const attendancePercentage = totalStudents > 0 
          ? (presentStudents / totalStudents) * 100 
          : 0;

        setStats({
          totalStudents,
          presentStudents,
          absentStudents,
          attendancePercentage,
        });
      } catch (error) {
        console.error('Error fetching attendance stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceStats();
  }, [user, courses, professors]);

  return { stats, loading };
}