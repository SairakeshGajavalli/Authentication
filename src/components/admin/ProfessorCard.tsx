import React from 'react';
import { BookOpen, Mail, Building, Pencil, Trash2, Plus } from 'lucide-react';
import type { Professor, Course } from '../../types';
import { AssignedCoursesList } from './AssignedCoursesList';

interface ProfessorCardProps {
  professor: Professor;
  courses: Course[];
  onEdit: (professor: Professor) => void;
  onDelete: (id: string) => void;
  onAssignCourse: (professor: Professor) => void;
  onUnassignCourse: (professorId: string, courseId: string) => void;
}

export function ProfessorCard({ 
  professor, 
  courses, 
  onEdit, 
  onDelete, 
  onAssignCourse,
  onUnassignCourse,
}: ProfessorCardProps) {
  const assignedCourses = courses.filter(course => professor.courses.includes(course.id));

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{professor.name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(professor)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Edit professor"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(professor.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Delete professor"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          <span className="text-sm">{professor.email}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Building className="w-4 h-4 mr-2" />
          <span className="text-sm">{professor.department}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <BookOpen className="w-4 h-4 mr-2" />
          <span className="text-sm">{professor.courses.length} courses assigned</span>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Courses</h4>
          <AssignedCoursesList
            courses={assignedCourses}
            onUnassign={(courseId) => onUnassignCourse(professor.id, courseId)}
          />
        </div>
      </div>

      <button
        onClick={() => onAssignCourse(professor)}
        className="w-full flex items-center justify-center px-4 py-2 border border-blue-600 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="w-4 h-4 mr-2" />
        Assign Course
      </button>
    </div>
  );
}