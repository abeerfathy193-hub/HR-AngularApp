export interface IPosition {
  id: number;
  title: string;
  description?: string;
  departmentId: number;
  departmentName?: string;
  isActive: boolean;
}

export interface IPositionCreate {
  title: string;
  description?: string;
  departmentId: number;
  isActive: boolean;
}

export interface IPositionUpdate {
  id: number;
  title: string;
  description?: string;
  departmentId: number;
  isActive: boolean;
}

