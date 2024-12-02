import React from 'react';
import { X } from 'lucide-react';
import type { Course } from '../../types';

interface AssignedCoursesListProps {
  courses: Course[];
  onUnassign: (courseId: string) => void;
}

export function AssignedCoursesList({ courses, onUnassign }: AssignedCoursesListProps) {
  if (courses.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">No courses assigned</p>
    );
  }

  return (
    <div className="space-y-2">
      {courses.map((course) => (
        <div
          key={course.id}
          className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
        >
          <span className="text-sm">
            {course.code} - {course.name}
          </span>
          <button
            onClick={() => onUnassign(course.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Unassign course"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}