import axiosInstance from "../api/axiosInstance";
import type {
  DailyWorkCalendar,
  DailyWorkStatus,
  DailyWorkStatusRequest,
} from "../types/dailyWorkStatus";
const getCalendar = async (
  year: number,
  month: number,
): Promise<DailyWorkCalendar[]> => {
  const response = await axiosInstance.get(
    `/DailyWorkStatus/calendar?year=${year}&month=${month}`,
  );
  return response.data;
};
const getStatus = async (date: string): Promise<DailyWorkStatus | null> => {
  try {
    const response = await axiosInstance.get(`/DailyWorkStatus/${date}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};
const createStatus = async (request: DailyWorkStatusRequest): Promise<void> => {
  await axiosInstance.post("/DailyWorkStatus", request);
};
const updateStatus = async (
  date: string,
  request: DailyWorkStatusRequest,
): Promise<void> => {
  await axiosInstance.put(`/DailyWorkStatus/${date}`, request);
};
export { getCalendar, getStatus, createStatus, updateStatus };
