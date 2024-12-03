import React, { useState, useEffect } from 'react';
import { Plus, Users } from 'lucide-react';
import { useStudentStore } from '../../store/studentStore';
import { useCourseStore } from '../../store/courseStore';
import { StudentForm } from '../../components/admin/StudentForm';
import { StudentCard } from '../../components/admin/StudentCard';
import { AssignCourseModal } from '../../components/admin/AssignCourseModal';
import { StudentAttendanceModal } from '../../components/admin/StudentAttendanceModal';
import type { Student } from '../../types';

export function StudentsPage() {
  const { students, loading, fetchStudents, addStudent, updateStudent, deleteStudent } = useStudentStore();
  const { courses, fetchCourses, assignStudent, unassignStudent } = useCourseStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [assigningStudent, setAssigningStudent] = useState<Student | null>(null);
  const [viewingAttendance, setViewingAttendance] = useState<Student | null>(null);

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const handleSubmit = async (data: Omit<Student, 'id' | 'courses'>) => {
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, data);
      } else {
        await addStudent({
          ...data,
          courses: [],
        });
      }
      handleCloseForm();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingStudent(null);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleAssignCourse = (student: Student) => {
    setAssigningStudent(student);
  };

  const handleCourseAssigned = async (courseIds: string[]) => {
    if (assigningStudent) {
      try {
        for (const courseId of courseIds) {
          await assignStudent(courseId, assigningStudent.id);
        }
        await fetchStudents();
        setAssigningStudent(null);
      } catch (error) {
        console.error('Error assigning courses:', error);
      }
    }
  };

  const handleUnassignCourse = async (studentId: string, courseId: string) => {
    try {
      await unassignStudent(courseId, studentId);
      await fetchStudents();
    } catch (error) {
      console.error('Error unassigning course:', error);
    }
  };

  const handleViewAttendance = (student: Student) => {
    setViewingAttendance(student);
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
          <Users className="w-6 h-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            courses={courses}
            onEdit={handleEdit}
            onDelete={deleteStudent}
            onAssignCourse={handleAssignCourse}
            onUnassignCourse={handleUnassignCourse}
            onViewAttendance={handleViewAttendance}
          />
        ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h2>
            <StudentForm
              onSubmit={handleSubmit}
              initialData={editingStudent || undefined}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}

      {assigningStudent && (
        <AssignCourseModal
          student={assigningStudent}
          onAssign={handleCourseAssigned}
          onCancel={() => setAssigningStudent(null)}
          availableCourses={courses.filter(
            course => !assigningStudent.courses.includes(course.id)
          )}
        />
      )}

      {viewingAttendance && (
        <StudentAttendanceModal
          studentId={viewingAttendance.id}
          studentName={viewingAttendance.name}
          onClose={() => setViewingAttendance(null)}
        />
      )}
    </div>
  );
}