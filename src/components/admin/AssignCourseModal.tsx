import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Professor, Student, Course } from '../../types';

const assignCourseSchema = z.object({
  courseIds: z.array(z.string()).min(1, 'Please select at least one course'),
});

type AssignCourseFormData = z.infer<typeof assignCourseSchema>;

interface AssignCourseModalProps {
  professor?: Professor;
  student?: Student;
  onAssign: (courseIds: string[]) => void;
  onCancel: () => void;
  availableCourses: Course[];
}

export function AssignCourseModal({
  professor,
  student,
  onAssign,
  onCancel,
  availableCourses,
}: AssignCourseModalProps) {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const title = professor 
    ? `Assign Courses to ${professor.name}`
    : `Assign Courses to ${student?.name}`;

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourses.length > 0) {
      onAssign(selectedCourses);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Courses
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableCourses.map((course) => (
                <label
                  key={course.id}
                  className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course.id)}
                    onChange={() => handleCourseToggle(course.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2">
                    {course.code} - {course.name}
                  </span>
                </label>
              ))}
            </div>
            {selectedCourses.length === 0 && (
              <p className="mt-1 text-sm text-red-600">Please select at least one course</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedCourses.length === 0}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign Courses
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}