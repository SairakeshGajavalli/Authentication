import React from 'react';
import { BookOpen, GraduationCap, Pencil, Trash2, Users } from 'lucide-react';
import type { Course, Professor } from '../../types';

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  professors: Professor[];
}

export function CourseCard({ course, onEdit, onDelete, professors }: CourseCardProps) {
  const assignedProfessors = professors.filter(p => p.courses.includes(course.id));

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

      <div className="space-y-4">
        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {course.students.length} students enrolled
            </span>
          </div>
          <div className="flex items-center">
            <GraduationCap className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {assignedProfessors.length} {assignedProfessors.length === 1 ? 'professor' : 'professors'}
            </span>
          </div>
        </div>

        {assignedProfessors.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Professors</h4>
            <div className="space-y-2">
              {assignedProfessors.map(professor => (
                <div key={professor.id} className="flex items-start space-x-3 text-sm">
                  <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{professor.name}</p>
                    <p className="text-gray-500 text-xs">{professor.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}