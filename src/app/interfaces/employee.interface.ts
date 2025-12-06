import { CreatePerson, GenderType, MaritalStatus, MilitaryStatus } from './register.interface';

// Role interface
export interface Role {
  name: string;
}

// Employee Files interface
export interface EmployeeFiles {
  nationalIdFile?: File;
  passportFile?: File;
  birthCertificateFile?: File;
}

// Person Files interface (reusing from register)
export interface PersonFiles {
  imgFile?: File;
  cvFile?: File;
  militaryFile?: File;
  educationFile?: File;
}

// Create Employee DTO - Employee identification and contract details
export interface CreateEmployeeDto {
  nationalId?: string;
  passPort?: string;
  ssnId?: string;
  personId?: number;
  contractId?: number;
  positionId?: number;
}

// Add Employee - Main interface combining all employee data
export interface AddEmployee {
  password: string;
  createEmployeeDto: CreateEmployeeDto;
  createPerson: CreatePerson;
  role: Role;
  // Files will be handled separately in FormData
}

// Employee DTO for display/response
export interface EmployeeDto {
  id: number;
  nationalId?: string;
  passPort?: string;
  ssnId?: string;
  personId?: number;
  contractId?: number;
  positionId?: number;
  positionName?: string;
  contractTitle?: string;
  fullName: string;
  birthDate: string;
  gender: GenderType;
  address: string;
  country: string;
  maritalStatus: MaritalStatus;
  nationality: string;
  education: string;
  militaryStatus: MilitaryStatus;
  email: string;
  phoneNumber: string;
  userName: string;
  roleName?: string;
  isActive?: boolean;
}

// Update Employee DTO
export interface UpdateEmployeeDto {
  id: number;
  createEmployeeDto: CreateEmployeeDto;
  createPerson: CreatePerson;
  role: Role;
}

