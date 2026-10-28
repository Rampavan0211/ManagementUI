export interface Employee {
  id: number;
  organisationId: number | null;

  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;

  roleId: number;
  roleName: string;

  active: boolean;

  createdDate: string;
  updatedDate: string | null;
  deactivatedDate: string | null;
}

export interface Role {
  id: number;
  name: string;
}

export interface OrganisationOption {
  id: number;
  name: string;
}

export interface CreateEmployee {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  roleId: number;
  organisationId: number | null;
}

export interface UpdateEmployee {
  firstName: string;
  lastName: string;
  phone?: string;
  roleId: number;
  organisationId: number | null;
}