export interface DailyWorkCalendar {
  date: string;
  totalHours: number;
  dailyWorkingHours: number;
  hasAttendance: boolean;
  hasDailyStatus: boolean;
  status: "red" | "yellow" | "green" | "blue";
}
export interface DailyWorkStatus {
  id: number;
  employeeId: number;
  employeeName: string;
  workDate: string;
  workDescription: string;
  achievements?: string | null;
  challenges?: string | null;
  remarks?: string | null;
  submittedDate: string;
  updatedDate?: string | null;
  totalHours: number;
  dailyWorkingHours: number;
  hasAttendance: boolean;
  attendanceStatus: "red" | "yellow" | "green" | "blue";
}
export interface DailyWorkStatusRequest {
  workDate: string;
  workDescription: string;
  achievements?: string;
  challenges?: string;
  remarks?: string;
}
