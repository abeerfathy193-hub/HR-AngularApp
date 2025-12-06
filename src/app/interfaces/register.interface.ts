// Enums
export enum GenderType {
  Male = 'Male',
  Female = 'Female'
}

export enum MaritalStatus {
  Single = 'Single',
  Married = 'Married',
  Divorced = 'Divorced',
  Widowed = 'Widowed'
}

export enum MilitaryStatus {
  Exempted = 'Exempted',
  Postponement = 'Postponement',
  Terminated = 'Terminated'
}

// Interfaces
export interface CreatePerson {
  fullName: string;
  birthDate: string; // DateOnly - will be formatted as YYYY-MM-DD
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
}

export interface ApplicantCreate {
  currentJobTitle?: string;
  currentCompany?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  professionalSummary?: string;
}

export interface RegisterRequest {
  password: string;
  applicantCreate: ApplicantCreate;
  createPerson: CreatePerson;
  // Files will be appended to FormData separately
}

