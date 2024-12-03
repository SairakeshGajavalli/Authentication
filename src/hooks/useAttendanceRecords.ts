import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { AttendanceRecord, AttendanceStatus } from '../types';

export function useAttendanceRecords(studentId?: string, courseId?: string) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const constraints = [];
        if (studentId) constraints.push(where('studentId', '==', studentId));
        if (courseId) constraints.push(where('courseId', '==', courseId));

        const attendanceQuery = query(collection(db, 'attendance'), ...constraints);
        const snapshot = await getDocs(attendanceQuery);
        
        const records = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate(),
        })) as AttendanceRecord[];

        setRecords(records);
      } catch (error) {
        console.error('Error fetching attendance records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [studentId, courseId]);

  const updateStatus = async (recordId: string, newStatus: AttendanceStatus) => {
    try {
      const recordRef = doc(db, 'attendance', recordId);
      await updateDoc(recordRef, { status: newStatus });
      
      setRecords(prev =>
        prev.map(record =>
          record.id === recordId
            ? { ...record, status: newStatus }
            : record
        )
      );
    } catch (error) {
      console.error('Error updating attendance status:', error);
      throw error;
    }
  };

  return {
    records,
    loading,
    updateStatus,
  };
}