

    export interface Holiday {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    description?: string;
    isActive: boolean;
    }

    export interface HolidayCreateDto {
    name: string;
    startDate: string;
    endDate: string;
    description?: string;
    createdBy: string;
    }

    export interface HolidayUpdateDto {
    name: string;
    startDate: string;
    endDate: string;
    description?: string;
    updatedBy: string;
    }

    export interface SyncResponse {
    message: string;
    addedCount: number;
    year: number;
    country: string;
    }

    export interface PreviewHoliday {
    name: string;
    date: string;
    description?: string;
    type?: string;
    }

    export interface PreviewResponse {
    count: number;
    holidays: PreviewHoliday[];
    }