import React, { useState } from 'react';
import { QRScannerView } from './QRScannerView';
import { AttendanceForm } from '../student/AttendanceForm';
import { parseAttendanceURL } from '../../utils/scanner';

export function AttendanceScanner() {
  const [scanData, setScanData] = useState<{
    courseId: string;
    sessionId: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = (data: string) => {
    try {
      const parsedData = parseAttendanceURL(data);
      setScanData(parsedData);
    } catch (err) {
      setError('Invalid QR code. Please try again.');
    }
  };

  const handleError = (error: string) => {
    setError(error);
  };

  const handleClose = () => {
    setScanData(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {!scanData && (
        <QRScannerView 
          onScan={handleScan}
          onError={handleError}
        />
      )}

      {scanData && (
        <AttendanceForm
          courseId={scanData.courseId}
          sessionId={scanData.sessionId}
          onClose={handleClose}
        />
      )}

      {error && !scanData && (
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}