import React, { useEffect } from 'react';
import { BookOpen, GraduationCap, Mail, Building } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCourseStore } from '../../store/courseStore';
import { useProfessorStore } from '../../store/professorStore';

export function StudentCoursesPage() {
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

  const enrolledCourses = courses.filter(course => 
    course.students.includes(user?.id || '')
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">You are not enrolled in any courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => {
            const professor = professors.find(p => p.courses.includes(course.id));
            return (
              <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-600">{course.code}</p>
                </div>

                {professor ? (
                  <div className="space-y-3">
                    <div className="border-t pt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Professor Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <GraduationCap className="w-4 h-4 mr-2" />
                          <span className="text-sm">{professor.name}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          <span className="text-sm">{professor.email}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Building className="w-4 h-4 mr-2" />
                          <span className="text-sm">{professor.department}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No professor assigned</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}