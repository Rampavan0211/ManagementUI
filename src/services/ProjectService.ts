import type {
  Project,
  CreateProject,
  UpdateProject,
  Manager,
} from "../types/project";

import api from "../api/axiosInstance";

function extractErrorMessage(error: any, fallback: string): string {
  return error?.response?.data?.message || fallback;
}

// ============================================================
// GET ALL PROJECTS
// ============================================================

export async function getProjects(): Promise<Project[]> {
  try {
    const response = await api.get<Project[]>("/Project");
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load projects."));
  }
}

// ============================================================
// GET PROJECT BY ID
// ============================================================

export async function getProjectById(id: number): Promise<Project> {
  try {
    const response = await api.get<Project>(`/Project/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load project."));
  }
}

// ============================================================
// GET MANAGERS
// ============================================================

export async function getManagers(): Promise<Manager[]> {
  try {
    const response = await api.get<Manager[]>("/Project/managers");
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load managers."));
  }
}

// ============================================================
// CREATE PROJECT
// ============================================================

export async function createProject(project: CreateProject): Promise<Project> {
  try {
    const response = await api.post<Project>("/Project", project);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to create project."));
  }
}

// ============================================================
// UPDATE PROJECT
// ============================================================

export async function updateProject(id: number, project: UpdateProject): Promise<Project> {
  try {
    const response = await api.put<Project>(`/Project/${id}`, project);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to update project."));
  }
}

// ============================================================
// DELETE PROJECT
// ============================================================

export async function deleteProject(id: number): Promise<void> {
  try {
    await api.delete(`/Project/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to delete project."));
  }
}

export async function getMyEmployeeProjects(): Promise<Project[]> {
  try {
    const response = await api.get<Project[]>("/Project/employee/my-projects");
    return response.data;
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to load your assigned projects.")
    );
  }
}
