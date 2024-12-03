export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'professor' | 'student';
}

export interface Professor {
  id: string;
  name: string;
  email: string;
  department: string;
  courses: string[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  courses: string[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  professorId: string;
  students: string[];
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  courseId: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  timestamp: Date;
  status: AttendanceStatus;
  comment?: string;
}

export interface StudentAttendance extends Student {
  attendanceCount: number;
  lastAttendance?: Date;
  attendanceRecords: AttendanceRecord[];
}