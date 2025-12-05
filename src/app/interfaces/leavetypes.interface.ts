    // src/app/models/leave-type.model.ts

    export interface LeaveType {
    id: number;
    name: string;
    description?: string;
    maxDaysPerYear?: number;
    isPaid?: boolean;
    requiresApproval?: boolean;
    requiresAttachment?: boolean;
    isActive?: boolean;
    createdBy?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedAt?: string;
    }

    export interface LeaveTypeCreateDto {
    name: string;
    description?: string;
    maxDaysPerYear?: number;
    isPaid?: boolean;
    requiresApproval?: boolean;
    requiresAttachment?: boolean;
    isActive?: boolean;
    }

    export interface LeaveTypeUpdateDto {
    id: number;
    name: string;
    description?: string;
    maxDaysPerYear?: number;
    isPaid?: boolean;
    requiresApproval?: boolean;
    requiresAttachment?: boolean;
    isActive?: boolean;
    }