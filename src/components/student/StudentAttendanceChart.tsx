import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CourseAttendance {
  courseName: string;
  presentCount: number;
  totalClasses: number;
}

interface StudentAttendanceChartProps {
  presentCount: number;
  absentCount: number;
  courseStats: CourseAttendance[];
}

export function StudentAttendanceChart({ 
  presentCount, 
  absentCount,
  courseStats 
}: StudentAttendanceChartProps) {
  const data = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [presentCount, absentCount],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderColor: ['#16a34a', '#dc2626'],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = presentCount + absentCount;
            const value = context.raw as number;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Attendance</h2>
      <div className="w-full max-w-md mx-auto mb-6">
        <Pie data={data} options={options} />
      </div>

      <div className="mt-6">
        <h3 className="text-md font-medium text-gray-800 mb-3">Course-wise Attendance</h3>
        <div className="space-y-3">
          {courseStats.map((stat) => (
            <div key={stat.courseName} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{stat.courseName}</span>
                <span className="font-medium text-gray-900">
                  {((stat.presentCount / stat.totalClasses) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${(stat.presentCount / stat.totalClasses) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}