import type {
  Employee,
  Role,
  OrganisationOption,
  CreateEmployee,
  UpdateEmployee,
} from "../types/employee";

import { getOrganisations } from "./OrganisationService";
import api from "../api/axiosInstance";

// =========================
// Get all employees
// =========================

export async function getEmployees(): Promise<Employee[]> {
  const response = await api.get<Employee[]>("/Employee");
  return response.data;
}

// =========================
// Get employee by ID
// =========================

export async function getEmployeeById(id: number): Promise<Employee> {
  const response = await api.get<Employee>(`/Employee/${id}`);
  return response.data;
}

// =========================
// Get employee roles
// =========================

export async function getEmployeeRoles(): Promise<Role[]> {
  const response = await api.get<Role[]>("/Employee/roles");
  return response.data;
}

// =========================
// Get organisations
// =========================
// Uses OrganisationService instead of
// making another Organisation API call here.

export async function getEmployeeOrganisations(): Promise<OrganisationOption[]> {
  const organisations = await getOrganisations();

  return organisations.map((organisation) => ({
    id: organisation.id,
    name: organisation.name,
  }));
}

// =========================
// Create employee
// =========================

export async function createEmployee(employee: CreateEmployee): Promise<Employee> {
  const response = await api.post<Employee>("/Employee", employee);
  return response.data;
}

// =========================
// Update employee
// =========================

export async function updateEmployee(id: number, employee: UpdateEmployee): Promise<Employee> {
  const response = await api.put<Employee>(`/Employee/${id}`, employee);
  return response.data;
}

// =========================
// Delete employee
// =========================

export async function deleteEmployee(id: number): Promise<void> {
  await api.delete(`/Employee/${id}`);
}

export async function getManagerAvailableEmployees(): Promise<Employee[]> {
  const response = await api.get<Employee[]>("/Employee/manager/available");
  return response.data;
}
