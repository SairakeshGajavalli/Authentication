import React from 'react';

interface AttendanceProgressProps {
  percentage: number;
}

export function AttendanceProgress({ percentage }: AttendanceProgressProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-600">Overall Attendance Rate</p>
          <div className="mt-1 relative pt-1">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${percentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
              ></div>
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-700">
              {percentage.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}