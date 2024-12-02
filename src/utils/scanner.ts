export function parseAttendanceURL(url: string) {
  const parsedUrl = new URL(url);
  const courseId = parsedUrl.searchParams.get('courseId');
  const sessionId = parsedUrl.searchParams.get('sessionId');

  if (!courseId || !sessionId) {
    throw new Error('Invalid QR code data');
  }

  return {
    courseId,
    sessionId,
  };
}