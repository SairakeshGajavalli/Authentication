import React, { useState, useEffect } from 'react';
import { Clock, X } from 'lucide-react';
import { QRGenerator } from '../QRGenerator';
import type { Course } from '../../types';

interface QRCodeModalProps {
  course: Course;
  onClose: () => void;
}

export function QRCodeModal({ course, onClose }: QRCodeModalProps) {
  const [minutes, setMinutes] = useState<number>(15);
  const [sessionId, setSessionId] = useState('');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // Default to 15 minutes in seconds
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Generate a unique session ID when the modal opens
    setSessionId(crypto.randomUUID());
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid positive number');
      return;
    }
    if (value > 180) { // 3 hours max
      setError('Maximum time allowed is 180 minutes');
      return;
    }
    setError('');
    setMinutes(value);
    setTimeLeft(value * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{course.name} - Attendance QR</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            QR Code Duration (minutes)
          </label>
          <input
            type="number"
            value={minutes}
            onChange={handleTimeChange}
            min="1"
            max="180"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter duration in minutes"
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Enter a duration between 1 and 180 minutes
          </p>
        </div>

        <div className="flex items-center justify-center text-lg font-semibold mb-4">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          <span>Time Remaining: {formatTime(timeLeft)}</span>
        </div>

        {timeLeft > 0 ? (
          <QRGenerator courseId={course.id} sessionId={sessionId} />
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">QR Code has expired</p>
            <button
              onClick={() => {
                setSessionId(crypto.randomUUID());
                setTimeLeft(minutes * 60);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Generate New QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}