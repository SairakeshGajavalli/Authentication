import React, { useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCourseStore } from '../../store/courseStore';
import { useProfessorStore } from '../../store/professorStore';
import { ProfessorCourseCard } from '../../components/professor/ProfessorCourseCard';

export function ProfessorCoursesPage() {
  const { user } = useAuthStore();
  const { courses, loading: coursesLoading, fetchCourses } = useCourseStore();
  const { professors, loading: professorsLoading, fetchProfessors } = useProfessorStore();

  useEffect(() => {
    fetchCourses();
    fetchProfessors();
  }, []);

  if (coursesLoading || professorsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const professor = professors.find(p => p.email === user?.email);
  const assignedCourses = courses.filter(course => professor?.courses.includes(course.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
      </div>

      {assignedCourses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">No courses have been assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedCourses.map((course) => (
            <ProfessorCourseCard
              key={course.id}
              course={course}
              professorName={professor?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}