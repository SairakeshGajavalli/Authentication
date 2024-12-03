import React, { useState } from 'react';
import { BookOpen, GraduationCap, QrCode, Users } from 'lucide-react';
import { QRCodeModal } from './QRCodeModal';
import { CourseStudentsModal } from './CourseStudentsModal';
import type { Course } from '../../types';

interface ProfessorCourseCardProps {
  course: Course;
  professorName?: string;
}

export function ProfessorCourseCard({ course, professorName }: ProfessorCourseCardProps) {
  const [showQRModal, setShowQRModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
            <p className="text-sm text-gray-600">{course.code}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center text-gray-600">
            <GraduationCap className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {professorName || 'No professor assigned'}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {course.students.length} students enrolled
            </span>
          </div>

          <div className="flex flex-col space-y-2">
            <button
              onClick={() => setShowQRModal(true)}
              className="flex items-center justify-center px-4 py-2 border border-blue-600 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Generate QR Code
            </button>

            <button
              onClick={() => setShowStudentsModal(true)}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Users className="w-4 h-4 mr-2" />
              View Students
            </button>
          </div>
        </div>
      </div>

      {showQRModal && (
        <QRCodeModal 
          course={course}
          onClose={() => setShowQRModal(false)}
        />
      )}

      {showStudentsModal && (
        <CourseStudentsModal
          course={course}
          onClose={() => setShowStudentsModal(false)}
        />
      )}
    </>
  );
}