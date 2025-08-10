export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

export function isBusinessHours(date: Date = new Date()): boolean {
  const hour = date.getHours();
  const dayOfWeek = date.getDay();
  
  // Monday to Friday, 9 AM to 5 PM
  return dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 9 && hour < 17;
}