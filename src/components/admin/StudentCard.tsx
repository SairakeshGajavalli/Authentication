import React from 'react';
import { BookOpen, Mail, Pencil, Trash2, Plus } from 'lucide-react';
import type { Student, Course } from '../../types';
import { AssignedCoursesList } from './AssignedCoursesList';

interface StudentCardProps {
  student: Student;
  courses: Course[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onAssignCourse: (student: Student) => void;
  onUnassignCourse: (studentId: string, courseId: string) => void;
}

export function StudentCard({ 
  student, 
  courses,
  onEdit, 
  onDelete, 
  onAssignCourse,
  onUnassignCourse,
}: StudentCardProps) {
  const assignedCourses = courses.filter(course => student.courses.includes(course.id));

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
          <p className="text-sm text-gray-600">{student.studentId}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(student)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Edit student"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(student.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Delete student"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          <span className="text-sm">{student.email}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <BookOpen className="w-4 h-4 mr-2" />
          <span className="text-sm">{student.courses.length} courses enrolled</span>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Enrolled Courses</h4>
          <AssignedCoursesList
            courses={assignedCourses}
            onUnassign={(courseId) => onUnassignCourse(student.id, courseId)}
          />
        </div>
      </div>

      <button
        onClick={() => onAssignCourse(student)}
        className="w-full flex items-center justify-center px-4 py-2 border border-blue-600 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="w-4 h-4 mr-2" />
        Assign Course
      </button>
    </div>
  );
}