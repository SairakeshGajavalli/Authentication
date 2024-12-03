import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock, X } from 'lucide-react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { AttendanceRecord, Course } from '../../types';

interface StudentAttendanceModalProps {
  studentId: string;
  studentName: string;
  onClose: () => void;
}

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export function StudentAttendanceModal({ 
  studentId, 
  studentName, 
  onClose 
}: StudentAttendanceModalProps) {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        // Fetch attendance records
        const attendanceQuery = query(
          collection(db, 'attendance'),
          where('studentId', '==', studentId)
        );
        const attendanceSnapshot = await getDocs(attendanceQuery);
        const records = attendanceSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate(),
        })) as AttendanceRecord[];

        // Fetch courses
        const coursesQuery = query(collection(db, 'courses'));
        const coursesSnapshot = await getDocs(coursesQuery);
        const coursesData = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[];

        setAttendanceRecords(records);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching attendance records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [studentId]);

  const handleStatusChange = async (recordId: string, newStatus: AttendanceStatus) => {
    try {
      const recordRef = doc(db, 'attendance', recordId);
      await updateDoc(recordRef, { status: newStatus });
      
      setAttendanceRecords(prev =>
        prev.map(record =>
          record.id === recordId
            ? { ...record, status: newStatus }
            : record
        )
      );
    } catch (error) {
      console.error('Error updating attendance status:', error);
    }
  };

  const getCourseName = (courseId: string) => {
    return courses.find(course => course.id === courseId)?.name || 'Unknown Course';
  };

  const getStatusBadgeClass = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'excused':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Attendance Records</h2>
            <p className="text-sm text-gray-600">{studentName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : attendanceRecords.length === 0 ? (
          <p className="text-center text-gray-600 py-8">No attendance records found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {format(record.timestamp, 'PPp')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {getCourseName(record.courseId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={record.status}
                        onChange={(e) => handleStatusChange(record.id, e.target.value as AttendanceStatus)}
                        className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="excused">Excused</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}