import React, { useState, useEffect } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { useCourseStore } from '../../store/courseStore';
import { useProfessorStore } from '../../store/professorStore';
import { CourseForm } from '../../components/admin/CourseForm';
import { CourseCard } from '../../components/admin/CourseCard';
import type { Course } from '../../types';

export function CoursesPage() {
  const { courses, addCourse, updateCourse, deleteCourse } = useCourseStore();
  const { professors, fetchProfessors } = useProfessorStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetchProfessors();
  }, []);

  const handleSubmit = (data: Omit<Course, 'id' | 'professorId' | 'students'>) => {
    if (editingCourse) {
      updateCourse(editingCourse.id, data);
    } else {
      addCourse({
        ...data,
        id: crypto.randomUUID(),
        professorId: '',
        students: [],
      });
    }
    handleCloseForm();
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCourse(null);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsFormOpen(true);
  };

  const getProfessorName = (professorId: string) => {
    const professor = professors.find((p) => p.courses.includes(professorId));
    return professor?.name;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEdit={handleEdit}
            onDelete={deleteCourse}
            professorName={getProfessorName(course.id)}
          />
        ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </h2>
            <CourseForm
              onSubmit={handleSubmit}
              initialData={editingCourse || undefined}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}