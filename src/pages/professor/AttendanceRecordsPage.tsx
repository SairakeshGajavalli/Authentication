import React from 'react';
import { BarChart, Users, UserCheck, UserX } from 'lucide-react';
import { StatCard } from '../../components/professor/analytics/StatCard';
import { AttendanceChart } from '../../components/professor/analytics/AttendanceChart';
import { AttendanceProgress } from '../../components/professor/analytics/AttendanceProgress';
import { useAttendanceStats } from '../../hooks/useAttendanceStats';

export function AttendanceRecordsPage() {
  const { stats, loading } = useAttendanceStats();

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
        <BarChart className="w-6 h-6 text-blue-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-900">Attendance Analytics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          Icon={Users}
        />
        <StatCard
          title="Present"
          value={stats.presentStudents}
          Icon={UserCheck}
          color="text-green-600"
        />
        <StatCard
          title="Absent"
          value={stats.absentStudents}
          Icon={UserX}
          color="text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AttendanceChart
          presentCount={stats.presentStudents}
          absentCount={stats.absentStudents}
        />
        <AttendanceProgress
          percentage={stats.attendancePercentage}
        />
      </div>
    </div>
  );
}