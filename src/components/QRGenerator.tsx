import React from 'react';
import QRCode from 'react-qr-code';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

interface QRGeneratorProps {
  courseId: string;
  sessionId: string;
}

export function QRGenerator({ courseId, sessionId }: QRGeneratorProps) {
  // Create a URL with query parameters for the external system
  const attendanceUrl = `https://attendance-recorder.onrender.com/?courseId=${encodeURIComponent(courseId)}&sessionId=${encodeURIComponent(sessionId)}&timestamp=${encodeURIComponent(new Date().toISOString())}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Attendance QR Code</h2>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{format(new Date(), 'HH:mm:ss')}</span>
        </div>
      </div>
      <div className="flex justify-center p-4 bg-white rounded-lg">
        <QRCode value={attendanceUrl} size={256} />
      </div>
      <p className="mt-4 text-sm text-gray-600 text-center">
        Scan this QR code to mark your attendance
      </p>
    </div>
  );
}