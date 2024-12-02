import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  BookOpen,
  LogOut,
  BarChart,
  QrCode,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function Sidebar() {
  const { user, logout } = useAuthStore();

  const adminLinks = [
    { to: '/admin/professors', icon: GraduationCap, label: 'Professors' },
    { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
    { to: '/admin/students', icon: Users, label: 'Students' },
  ];

  const professorLinks = [
    { to: '/professor/courses', icon: BookOpen, label: 'My Courses' },
    { to: '/professor/attendance', icon: BarChart, label: 'Attendance Records' },
  ];

  const studentLinks = [
    { to: '/student/courses', icon: BookOpen, label: 'My Courses' },
    { to: '/student/attendance', icon: QrCode, label: 'Attendance' },
  ];

  const links = user?.role === 'admin' 
    ? adminLinks 
    : user?.role === 'professor'
    ? professorLinks
    : studentLinks;

  return (
    <div className="h-screen w-64 bg-gray-800 text-white p-4 fixed left-0 top-0">
      <div className="mb-8">
        <h2 className="text-xl font-bold">QR Attendance</h2>
        <p className="text-gray-400 text-sm">{user?.name}</p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span>{link.label}</span>
          </NavLink>
        ))}

        <button
          onClick={logout}
          className="flex items-center space-x-2 p-2 rounded-lg text-gray-300 hover:bg-gray-700 w-full mt-8"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}