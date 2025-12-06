

        export interface ContractDto {
        id: number;
        title?: string;
        contractType?: string;
        startDate?: string;
        endDate?: string;
        baseSalary?: number;
        employeeId?: number;
        workingHoursPerDay?: string;
        annualLeaveDays?: number;
        probationPeriodDays?: number;
        noticePeriodDays?: number;
        isActive?: boolean;
        status?: string;
        contractPdfUrl?: string;
        points: ContractPointDto[];
        createdAt?: string;
        createdBy?: string;
        updatedAt?: string;
        updatedBy?: string;
        }
    export interface ContractPointDto {
        id: number;
        header: string;
        description: string;
        createdAt?: string;
        createdBy?: string;
        updatedAt?: string;
        updatedBy?: string;
        }
export interface ContractPointCreateDto {
  header: string;
  description: string;
  createdBy?: string;
}


    export interface ContractCreateDto {
  title?: string;
  contractType?: string;
  startDate?: string;
  endDate?: string;
  baseSalary?: number;
  employeeId?: number;
  workingHoursPerDay?: string;
  annualLeaveDays?: number;
  probationPeriodDays?: number;
  noticePeriodDays?: number;
  points?: ContractPointCreateDto[];
}
export enum ContractType {
  FullTime = 'FullTime',
  PartTime = 'PartTime',
  Internship = 'Internship'
}


