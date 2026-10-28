import api from "../api/axiosInstance";

export interface AttendanceSession {
  id: number;
  clockIn: string;
  clockOut: string | null;
  durationHours: number;
}

export interface Attendance {
  id: number;
  employeeId: number;
  attendanceDate: string;
  totalHours: number;
  isOvertime: boolean;
  isClockedIn: boolean;
  isClockedOut: boolean;
  sessions: AttendanceSession[];
}

export async function clockIn(): Promise<Attendance> {
  const response = await api.post<Attendance>("/Attendance/clock-in");
  return response.data;
}

export async function clockOut(): Promise<Attendance> {
  const response = await api.post<Attendance>("/Attendance/clock-out");
  return response.data;
}

export async function getTodayAttendance(): Promise<Attendance | null> {
  const response = await api.get<Attendance | null>("/Attendance/today");
  return response.data;
}

export async function getMyAttendance(): Promise<Attendance[]> {
  const response = await api.get<Attendance[]>("/Attendance/my-attendance");
  return response.data;
}
