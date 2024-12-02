import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { useCourseStore } from '../store/courseStore';

interface CourseAttendance {
  courseName: string;
  presentCount: number;
  totalClasses: number;
}

interface AttendanceStats {
  presentCount: number;
  absentCount: number;
  courseStats: CourseAttendance[];
}

export function useStudentAttendance() {
  const { user } = useAuthStore();
  const { courses } = useCourseStore();
  const [stats, setStats] = useState<AttendanceStats>({
    presentCount: 0,
    absentCount: 0,
    courseStats: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceStats = async () => {
      if (!user) return;

      try {
        const enrolledCourses = courses.filter(course => 
          course.students.includes(user.id)
        );

        let totalPresent = 0;
        const courseStats: CourseAttendance[] = [];

        for (const course of enrolledCourses) {
          const attendanceQuery = query(
            collection(db, 'attendance'),
            where('courseId', '==', course.id),
            where('studentId', '==', user.id)
          );
          
          const querySnapshot = await getDocs(attendanceQuery);
          const presentCount = querySnapshot.size;
          
          // Assuming each course has had 10 classes for demo purposes
          // In a real app, you'd fetch the actual number of classes
          const totalClasses = 10;
          
          totalPresent += presentCount;
          courseStats.push({
            courseName: course.name,
            presentCount,
            totalClasses,
          });
        }

        const totalClasses = courseStats.reduce((sum, stat) => sum + stat.totalClasses, 0);
        const totalAbsent = totalClasses - totalPresent;

        setStats({
          presentCount: totalPresent,
          absentCount: totalAbsent,
          courseStats,
        });
      } catch (error) {
        console.error('Error fetching attendance stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceStats();
  }, [user, courses]);

  return { stats, loading };
}