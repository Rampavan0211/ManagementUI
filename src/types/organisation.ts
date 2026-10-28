export interface Industry {
  id: number;
  name: string;
  description?: string | null;
}

export interface Organisation {
  id: number;

  name: string;

  orgContact: string;

  orgContactEmail: string;

  orgContactPhone: string;

  industryId: number;

  industryName: string;

  description: string | null;

  address1: string;

  address2: string | null;

  city: string;

  state: string;

  country: string;

  zipcode: string;

  active: boolean;

  createdDate: string;

  updatedDate: string | null;

  deactivatedDate: string | null;
}

export interface CreateAdmin {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  notify: boolean;
}

export interface CreateOrganisation {
  name: string;
  orgContact: string;
  orgContactEmail: string;
  orgContactPhone: string;
  industryId: number;
  description: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;

  admin: CreateAdmin;
}

export interface UpdateOrganisation {
  name: string;
  orgContact: string;
  orgContactEmail: string;
  orgContactPhone: string;
  industryId: number;
  description: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  active: boolean;
}