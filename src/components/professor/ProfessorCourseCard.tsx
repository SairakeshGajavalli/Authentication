import React, { useState } from 'react';
import { BookOpen, GraduationCap, QrCode } from 'lucide-react';
import { QRCodeModal } from './QRCodeModal';
import type { Course } from '../../types';

interface ProfessorCourseCardProps {
  course: Course;
  professorName?: string;
}

export function ProfessorCourseCard({ course, professorName }: ProfessorCourseCardProps) {
  const [showQRModal, setShowQRModal] = useState(false);

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setShowQRModal(true)}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
            <p className="text-sm text-gray-600">{course.code}</p>
          </div>
          <QrCode className="w-5 h-5 text-blue-600" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <GraduationCap className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {professorName || 'No professor assigned'}
            </span>
          </div>
          <p className="text-sm text-blue-600 mt-4">Click to generate attendance QR code</p>
        </div>
      </div>

      {showQRModal && (
        <QRCodeModal 
          course={course}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </>
  );
}