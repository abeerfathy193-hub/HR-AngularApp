export interface IDepartment {
  id: number;
  name: string;
  description?: string;
  code: string;
  managerId?: number;
  managerName?: string;
  isActive: boolean;
}

export interface IDepartmentCreate {
  name: string;
  description?: string;
  code: string;
  managerId?: number;
  isActive: boolean;
}

export interface IDepartmentUpdate {
  id: number;
  name: string;
  description?: string;
  code: string;
  managerId?: number;
  isActive: boolean;
}