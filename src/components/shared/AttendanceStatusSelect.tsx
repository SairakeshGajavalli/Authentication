import React from 'react';
import type { AttendanceStatus } from '../../types';

interface AttendanceStatusSelectProps {
  value: AttendanceStatus;
  onChange: (status: AttendanceStatus) => void;
}

export function AttendanceStatusSelect({ value, onChange }: AttendanceStatusSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as AttendanceStatus)}
      className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
    >
      <option value="present">Present</option>
      <option value="absent">Absent</option>
      <option value="late">Late</option>
      <option value="excused">Excused</option>
    </select>
  );
}