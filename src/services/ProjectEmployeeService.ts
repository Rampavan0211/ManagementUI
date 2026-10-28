import api from "../api/axiosInstance";

export interface ProjectEmployee {
  id: number;
  projectId: number;
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  assignedDate: string;
  active: boolean;
}

export async function getProjectEmployees(projectId: number): Promise<ProjectEmployee[]> {
  const response = await api.get<ProjectEmployee[]>(`/ProjectEmployee/project/${projectId}`);
  return response.data;
}

export async function assignEmployeeToProject(
  projectId: number,
  employeeId: number
): Promise<ProjectEmployee> {
  const response = await api.post<ProjectEmployee>(
    `/ProjectEmployee/project/${projectId}/assign`,
    { employeeId }
  );
  return response.data;
}

export async function removeEmployeeFromProject(assignmentId: number): Promise<void> {
  await api.delete(`/ProjectEmployee/${assignmentId}`);
}
