import React from 'react';
import { QrCode } from 'lucide-react';
import { StudentAttendanceChart } from '../../components/student/StudentAttendanceChart';
import { AttendanceScanner } from '../../components/scanner/AttendanceScanner';
import { useStudentAttendance } from '../../hooks/useStudentAttendance';

export function StudentAttendancePage() {
  const { stats, loading } = useStudentAttendance();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <QrCode className="w-6 h-6 text-blue-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StudentAttendanceChart
          presentCount={stats.presentCount}
          absentCount={stats.absentCount}
          courseStats={stats.courseStats}
        />
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mark Attendance</h2>
          <AttendanceScanner />
        </div>
      </div>
    </div>
  );
}