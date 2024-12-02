import React from 'react';
import { BookOpen, GraduationCap, Pencil, Trash2 } from 'lucide-react';
import type { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  professorName?: string;
}

export function CourseCard({ course, onEdit, onDelete, professorName }: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
          <p className="text-sm text-gray-600">{course.code}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(course)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Edit course"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(course.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Delete course"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-gray-600">
          <GraduationCap className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {professorName || 'No professor assigned'}
          </span>
        </div>
      </div>
    </div>
  );
}