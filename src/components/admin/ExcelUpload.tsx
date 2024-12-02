import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { Student } from '../../types';

interface ExcelUploadProps {
  onUpload: (students: Omit<Student, 'id' | 'courses'>[]) => void;
}

export function ExcelUpload({ onUpload }: ExcelUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const students = jsonData.map((row: any) => ({
          name: row.name,
          email: row.email,
          studentId: row.studentId?.toString() || '',
        }));

        onUpload(students);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        alert('Error processing Excel file. Please check the format and try again.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex items-center justify-center w-full">
      <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-blue-500 cursor-pointer hover:bg-blue-50">
        <Upload className="w-8 h-8 text-blue-500" />
        <span className="mt-2 text-base">Upload Excel File</span>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
}