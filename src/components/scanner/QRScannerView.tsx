import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Camera, AlertCircle } from 'lucide-react';

interface QRScannerViewProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
}

export function QRScannerView({ onScan, onError }: QRScannerViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);

  useEffect(() => {
    const checkCamera = async () => {
      try {
        const hasWebcam = await QrScanner.hasCamera();
        setHasCamera(hasWebcam);
        if (!hasWebcam) {
          const errorMsg = 'No camera found. Please ensure you have a working camera.';
          setError(errorMsg);
          onError?.(errorMsg);
        }
      } catch (err) {
        const errorMsg = 'Error accessing camera. Please check permissions.';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    };

    checkCamera();
  }, [onError]);

  useEffect(() => {
    if (!videoRef.current || !hasCamera) return;

    const qrScanner = new QrScanner(
      videoRef.current,
      (result) => {
        try {
          const url = new URL(result.data);
          if (url.hostname === 'attendance-recorder.onrender.com') {
            onScan(result.data);
            qrScanner.stop();
          } else {
            setError('Invalid QR code. Please scan a valid attendance QR code.');
          }
        } catch (err) {
          setError('Invalid QR code format.');
        }
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        returnDetailedScanResult: true,
      }
    );

    setScanner(qrScanner);
    qrScanner.start().catch((err) => {
      setError('Failed to start camera. Please check permissions.');
      onError?.('Camera access error');
    });

    return () => {
      qrScanner.destroy();
    };
  }, [hasCamera, onScan, onError]);

  if (!hasCamera) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600 font-medium">Camera not found</p>
        <p className="text-red-500 text-sm mt-1">
          Please ensure you have a working camera and have granted camera permissions.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Camera className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Scan Attendance QR</h2>
          </div>
        </div>

        <div className="relative aspect-square max-w-md mx-auto p-4">
          <video 
            ref={videoRef} 
            className="w-full h-full rounded-lg border-2 border-blue-100"
          />
          
          {/* Scanning overlay */}
          <div className="absolute inset-0 border-2 border-blue-400 rounded-lg pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="w-full h-1 bg-blue-400 animate-scan" />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-t border-red-100">
            <div className="flex items-center text-red-600">
              <AlertCircle className="w-4 h-4 mr-2" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-600 text-center">
            Position the QR code within the frame to scan
          </p>
        </div>
      </div>
    </div>
  );
}