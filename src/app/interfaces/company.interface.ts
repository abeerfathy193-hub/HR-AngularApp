export interface ICompany {
    id: number,
    companyName: string,
    address: string,
    latitude: number,
    longitude: number,
    allowedRadiusMeters: number,
    contactEmail?: string,
    contactPhone?: string,
    websiteUrl?: string,
    domainUrl: string,
    companyLogo?: string,
    companyHeader?: string,
    companyFooter?: string,
    taxRegistrationNumber: string;
    commercialNumber: string
    workStartTime?: number;
    workEndTime?: number;
}