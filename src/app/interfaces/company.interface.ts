export interface CompanyCreateDto {
    CompanyName: string;
    Address: string;
    Latitude: number;
    Longitude: number;
    AllowedRadiusMeters: number;
    ContactEmail: string;
    ContactPhone: string;
    DomainUrl: string;
    LogoUrl?: string;
    HeaderUrl?: string;
    FooterUrl?: string;
    TaxRegistrationNumber: string;
    CommercialNumber: string;
}

export interface CompanyUpdateDto {
    Id: number;
    CompanyName: string;
    Address: string;
    Latitude?: number;
    Longitude?: number;
    AllowedRadiusMeters?: number;
    ContactEmail: string;
    ContactPhone: string;
    DomainUrl: string;
    LogoUrl?: string;
    HeaderUrl?: string;
    FooterUrl?: string;
    TaxRegistrationNumber: string;
    CommercialNumber: string;
}