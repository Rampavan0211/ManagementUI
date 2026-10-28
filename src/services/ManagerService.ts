import api from "../api/axiosInstance";

export interface ManagerProject {
  id: number;
  name: string;
  description: string | null;
  organisationId: number;
  organisationName: string;
  managerId: number;
  managerName: string;
  active: boolean;
  createdDate: string;
}

export async function getMyProjects(): Promise<ManagerProject[]> {
  const response = await api.get<ManagerProject[]>("/Project/manager/my-projects");
  return response.data;
}
