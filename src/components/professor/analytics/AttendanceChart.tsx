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

interface AttendanceChartProps {
  presentCount: number;
  absentCount: number;
}

export function AttendanceChart({ presentCount, absentCount }: AttendanceChartProps) {
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
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance Distribution</h2>
      <div className="w-full max-w-md mx-auto">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}