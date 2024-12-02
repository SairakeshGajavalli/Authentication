import React, { useState, useEffect } from 'react';
import { Plus, GraduationCap } from 'lucide-react';
import { useProfessorStore } from '../../store/professorStore';
import { useCourseStore } from '../../store/courseStore';
import { ProfessorForm } from '../../components/admin/ProfessorForm';
import { ProfessorCard } from '../../components/admin/ProfessorCard';
import { AssignCourseModal } from '../../components/admin/AssignCourseModal';
import type { Professor } from '../../types';

export function ProfessorsPage() {
  const { professors, loading, fetchProfessors, addProfessor, updateProfessor, deleteProfessor } = useProfessorStore();
  const { courses, fetchCourses, updateCourse } = useCourseStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);
  const [assigningProfessor, setAssigningProfessor] = useState<Professor | null>(null);

  useEffect(() => {
    fetchProfessors();
    fetchCourses();
  }, []);

  const handleSubmit = async (data: Omit<Professor, 'id' | 'courses'>) => {
    try {
      if (editingProfessor) {
        await updateProfessor(editingProfessor.id, data);
      } else {
        await addProfessor({
          ...data,
          courses: [],
        });
      }
      handleCloseForm();
    } catch (error) {
      console.error('Error saving professor:', error);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProfessor(null);
  };

  const handleEdit = (professor: Professor) => {
    setEditingProfessor(professor);
    setIsFormOpen(true);
  };

  const handleAssignCourse = (professor: Professor) => {
    setAssigningProfessor(professor);
  };

  const handleCourseAssigned = async (courseIds: string[]) => {
    if (assigningProfessor) {
      try {
        const updatedCourses = [...new Set([...assigningProfessor.courses, ...courseIds])];
        await updateProfessor(assigningProfessor.id, {
          courses: updatedCourses,
        });
        setAssigningProfessor(null);
        await fetchProfessors();
      } catch (error) {
        console.error('Error assigning courses:', error);
      }
    }
  };

  const handleUnassignCourse = async (professorId: string, courseId: string) => {
    try {
      const professor = professors.find(p => p.id === professorId);
      if (professor) {
        const updatedCourses = professor.courses.filter(id => id !== courseId);
        await updateProfessor(professorId, {
          courses: updatedCourses,
        });
        await fetchProfessors();
      }
    } catch (error) {
      console.error('Error unassigning course:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <GraduationCap className="w-6 h-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Professors</h1>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Professor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professors.map((professor) => (
          <ProfessorCard
            key={professor.id}
            professor={professor}
            courses={courses}
            onEdit={handleEdit}
            onDelete={deleteProfessor}
            onAssignCourse={handleAssignCourse}
            onUnassignCourse={handleUnassignCourse}
          />
        ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingProfessor ? 'Edit Professor' : 'Add New Professor'}
            </h2>
            <ProfessorForm
              onSubmit={handleSubmit}
              initialData={editingProfessor || undefined}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}

      {assigningProfessor && (
        <AssignCourseModal
          professor={assigningProfessor}
          onAssign={handleCourseAssigned}
          onCancel={() => setAssigningProfessor(null)}
          availableCourses={courses.filter(
            course => !assigningProfessor.courses.includes(course.id)
          )}
        />
      )}
    </div>
  );
}