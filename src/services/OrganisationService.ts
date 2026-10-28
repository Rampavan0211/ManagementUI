import type {
  Organisation,
  CreateOrganisation,
  UpdateOrganisation,
  Industry,
} from "../types/organisation";

import api from "../api/axiosInstance";

export async function getOrganisations(): Promise<Organisation[]> {
  const response = await api.get<Organisation[]>("/Organisation");
  return response.data;
}

export async function getOrganisationById(id: number): Promise<Organisation> {
  const response = await api.get<Organisation>(`/Organisation/${id}`);
  return response.data;
}

export async function createOrganisation(data: CreateOrganisation): Promise<Organisation> {
  const response = await api.post<Organisation>("/Organisation", data);
  return response.data;
}

export async function updateOrganisation(id: number, data: UpdateOrganisation): Promise<Organisation> {
  const response = await api.put<Organisation>(`/Organisation/${id}`, data);
  return response.data;
}

export async function getIndustries(): Promise<Industry[]> {
  const response = await api.get<Industry[]>("/Industry");
  return response.data;
}
