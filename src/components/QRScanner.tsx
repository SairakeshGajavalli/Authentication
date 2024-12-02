import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Camera } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
  const [hasCamera, setHasCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          try {
            // Check if the scanned URL is from our attendance system
            const url = new URL(result.data);
            if (url.origin === 'https://attendance-recorder.onrender.com') {
              // Stop scanning and redirect
              scanner?.stop();
              window.location.href = result.data;
            }
          } catch (error) {
            console.error('Invalid QR code data:', error);
          }
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      QrScanner.hasCamera().then(setHasCamera);
      setScanner(qrScanner);
      qrScanner.start();

      return () => {
        qrScanner.destroy();
      };
    }
  }, [onScan]);

  if (!hasCamera) {
    return (
      <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
        No camera found. Please ensure you have a working camera.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <Camera className="w-5 h-5 mr-2 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Scan Attendance QR</h2>
        </div>
        <div className="relative aspect-square max-w-md mx-auto">
          <video ref={videoRef} className="w-full h-full rounded-lg" />
        </div>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Position the QR code within the frame to scan
        </p>
      </div>
    </div>
  );
}