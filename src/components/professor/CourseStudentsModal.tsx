import React, { useState, useEffect } from 'react';
import { X, User, Mail, Clock } from 'lucide-react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { format } from 'date-fns';
import type { Course, Student, AttendanceRecord } from '../../types';

interface CourseStudentsModalProps {
  course: Course;
  onClose: () => void;
}

interface StudentAttendance extends Student {
  attendanceCount: number;
  lastAttendance?: Date;
  attendanceRecords: AttendanceRecord[];
}

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export function CourseStudentsModal({ course, onClose }: CourseStudentsModalProps) {
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Fetch all enrolled students
        const studentsQuery = query(collection(db, 'students'));
        const studentsSnapshot = await getDocs(studentsQuery);
        const studentsData = studentsSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(student => course.students.includes(student.id)) as Student[];

        // Fetch attendance records for each student
        const studentsWithAttendance = await Promise.all(
          studentsData.map(async (student) => {
            const attendanceQuery = query(
              collection(db, 'attendance'),
              where('studentId', '==', student.id),
              where('courseId', '==', course.id)
            );
            const attendanceSnapshot = await getDocs(attendanceQuery);
            const attendanceRecords = attendanceSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              timestamp: doc.data().timestamp?.toDate(),
            })) as AttendanceRecord[];

            const lastAttendance = attendanceRecords.length > 0
              ? attendanceRecords.reduce((latest, current) => 
                  current.timestamp > latest.timestamp ? current : latest
                ).timestamp
              : undefined;

            return {
              ...student,
              attendanceCount: attendanceRecords.length,
              lastAttendance,
              attendanceRecords,
            };
          })
        );

        setStudents(studentsWithAttendance);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [course]);

  const handleStatusChange = async (recordId: string, newStatus: AttendanceStatus) => {
    try {
      const recordRef = doc(db, 'attendance', recordId);
      await updateDoc(recordRef, { status: newStatus });
      
      setStudents(prevStudents => 
        prevStudents.map(student => ({
          ...student,
          attendanceRecords: student.attendanceRecords.map(record =>
            record.id === recordId ? { ...record, status: newStatus } : record
          ),
        }))
      );
    } catch (error) {
      console.error('Error updating attendance status:', error);
    }
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
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Enrolled Students</h2>
            <p className="text-sm text-gray-600">{course.name} - {course.code}</p>
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
        ) : students.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No students enrolled in this course</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Attendance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <React.Fragment key={student.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {student.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            {student.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {student.studentId}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {student.attendanceCount} classes
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            {student.lastAttendance 
                              ? format(student.lastAttendance, 'PPp')
                              : 'Never attended'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedStudent(selectedStudent === student.id ? null : student.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            {selectedStudent === student.id ? 'Hide Records' : 'View Records'}
                          </button>
                        </td>
                      </tr>
                      {selectedStudent === student.id && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 bg-gray-50">
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                      Date & Time
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                      Status
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {student.attendanceRecords.map((record) => (
                                    <tr key={record.id}>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                                        {format(record.timestamp, 'PPp')}
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(record.status)}`}>
                                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                        </span>
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap">
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
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}