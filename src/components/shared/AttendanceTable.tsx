import React from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { AttendanceStatusBadge } from './AttendanceStatusBadge';
import { AttendanceStatusSelect } from './AttendanceStatusSelect';
import type { AttendanceRecord, AttendanceStatus } from '../../types';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onStatusChange: (recordId: string, status: AttendanceStatus) => void;
  showCourse?: boolean;
  getCourseName?: (courseId: string) => string;
}

export function AttendanceTable({ 
  records, 
  onStatusChange, 
  showCourse = false,
  getCourseName = () => 'Unknown Course',
}: AttendanceTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date & Time
          </th>
          {showCourse && (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Course
            </th>
          )}
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {records.map((record) => (
          <tr key={record.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-900">
                  {format(record.timestamp, 'PPp')}
                </span>
              </div>
            </td>
            {showCourse && (
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">
                  {getCourseName(record.courseId)}
                </span>
              </td>
            )}
            <td className="px-6 py-4 whitespace-nowrap">
              <AttendanceStatusBadge status={record.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <AttendanceStatusSelect
                value={record.status}
                onChange={(status) => onStatusChange(record.id, status)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}