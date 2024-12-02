import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProfessorsPage } from './pages/admin/ProfessorsPage';
import { CoursesPage } from './pages/admin/CoursesPage';
import { StudentsPage } from './pages/admin/StudentsPage';
import { ProfessorCoursesPage } from './pages/professor/ProfessorCoursesPage';
import { AttendanceRecordsPage } from './pages/professor/AttendanceRecordsPage';
import { StudentCoursesPage } from './pages/student/StudentCoursesPage';
import { StudentAttendancePage } from './pages/student/StudentAttendancePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<DashboardLayout />}>
          {/* Admin Routes */}
          <Route path="/admin">
            <Route path="professors" element={<ProfessorsPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="students" element={<StudentsPage />} />
          </Route>

          {/* Professor Routes */}
          <Route path="/professor">
            <Route path="courses" element={<ProfessorCoursesPage />} />
            <Route path="attendance" element={<AttendanceRecordsPage />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student">
            <Route path="courses" element={<StudentCoursesPage />} />
            <Route path="attendance" element={<StudentAttendancePage />} />
          </Route>
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;