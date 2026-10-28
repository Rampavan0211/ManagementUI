export interface Project {
  id: number;
  name: string;
  description: string | null;
  organisationId: number;
  organisationName: string;
  managerId: number;
  managerName: string;
  managerEmail: string;
  active: boolean;
  createdDate: string;
  createdBy: number | null;
  updatedDate: string | null;
  updatedBy: number | null;
  deactivatedDate: string | null;
  deactivatedBy: number | null;
}
export interface CreateProject {
  name: string;
  description: string;
  managerId: number;
}
export interface UpdateProject {
  name: string;
  description: string;
  managerId: number;
  active: boolean;
}
export interface Manager {
  id: number;
  name: string;
}
