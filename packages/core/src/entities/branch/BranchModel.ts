export interface OperatingHours {
    weekdays: string;
    saturday: string;
    sunday: string;
    holidays: string;
}

export interface BranchModel {
    id: string;
    name: string;
    streetName: string;
    subDistrict: string;
    ward: string;
    city: string;
    province: string;
    postalCode: string;
    area: string;
    address: string; // Full formatted address
    fullAddress: string; // Complete address with all details
    operatingHours: OperatingHours;
    telp: string;
    googleMapsUrl: string;
    latitude: number;
    longitude: number;
    employeeCount: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}
