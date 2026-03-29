import { ApiUseCase } from "../../base/ApiUseCase";
import { CustomerModel } from "../../entities/customer/CustomerModel";
import { HttpMethod } from "../../api-config";
import { ApiResponse } from "../../base/ApiResponse";

export class GetCustomerList extends ApiUseCase<string | undefined, CustomerModel[]> {
    async execute(query?: string): Promise<CustomerModel[]> {
        const response = await this.request<ApiResponse<CustomerModel[]>>(
            `/customers`,
            HttpMethod.GET,
            query ? { search: query } : undefined
        );
        return response.data;
    }

    async executeMock(query?: string): Promise<CustomerModel[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const allCustomers: CustomerModel[] = [
                    {
                        id: "21647f8e-916b-46ad-a373-8e7e96b2448b",
                        name: "Julia Rahmawati",
                        telp: "081298765010",
                        birthDate: 809049600000,
                        city: "Jakarta",
                        province: "DKI Jakarta",
                        subdistrict: "Pasar Minggu",
                        ward: "Ragunan",
                        postalCode: "12550",
                        fullAddress: "Jl. Ragunan No. 25, Pasar Minggu, Jakarta Selatan",
                        shortAddress: "Jl. Ragunan No. 25",
                        createdAt: "2026-01-17T20:02:44.607Z",
                        updatedAt: "2026-01-17T20:02:44.607Z",
                        deletedAt: null,
                    },
                    {
                        id: "9cf8e27e-ba8c-4265-962a-1e517bb6b278",
                        name: "Indra Gunawan",
                        telp: "081298765009",
                        birthDate: 608688000000,
                        city: "Jakarta",
                        province: "DKI Jakarta",
                        subdistrict: "Setiabudi",
                        ward: "Karet Kuningan",
                        postalCode: "12940",
                        fullAddress: "Jl. HR Rasuna Said No. 100, Setiabudi, Jakarta Selatan",
                        shortAddress: "Jl. HR Rasuna Said No. 100",
                        createdAt: "2026-01-17T20:02:44.606Z",
                        updatedAt: "2026-01-17T20:02:44.606Z",
                        deletedAt: null,
                    },
                    {
                        id: "fe339e51-8be1-4f16-b007-8755a571a033",
                        name: "Hani Permata",
                        telp: "081298765008",
                        birthDate: 678240000000,
                        city: "Jakarta",
                        province: "DKI Jakarta",
                        subdistrict: "Cilandak",
                        ward: "Cilandak Barat",
                        postalCode: "12430",
                        fullAddress: "Jl. Cilandak KKO No. 18, Cilandak, Jakarta Selatan",
                        shortAddress: "Jl. Cilandak KKO No. 18",
                        createdAt: "2026-01-17T20:02:44.605Z",
                        updatedAt: "2026-01-17T20:02:44.605Z",
                        deletedAt: null,
                    },
                    {
                        id: "b7140213-8a41-4ede-a387-f607bcc346fd",
                        name: "Gunawan Saputra",
                        telp: "081298765007",
                        birthDate: 439430400000,
                        city: "Jakarta",
                        province: "DKI Jakarta",
                        subdistrict: "Pancoran",
                        ward: "Duren Tiga",
                        postalCode: "12760",
                        fullAddress: "Jl. Duren Tiga No. 30, Pancoran, Jakarta Selatan",
                        shortAddress: "Jl. Duren Tiga No. 30",
                        createdAt: "2026-01-17T20:02:44.603Z",
                        updatedAt: "2026-01-17T20:02:44.603Z",
                        deletedAt: null,
                    },
                    {
                        id: "2f71ddeb-173f-41c3-b711-d2cb7a186063",
                        name: "Fitri Handayani",
                        telp: "081298765006",
                        birthDate: 761702400000,
                        city: "Jakarta",
                        province: "DKI Jakarta",
                        subdistrict: "Pondok Indah",
                        ward: "Pondok Pinang",
                        postalCode: "12310",
                        fullAddress: "Jl. Metro Pondok Indah No. 15, Kebayoran Lama, Jakarta Selatan",
                        shortAddress: "Jl. Metro Pondok Indah No. 15",
                        createdAt: "2026-01-17T20:02:44.602Z",
                        updatedAt: "2026-01-17T20:02:44.602Z",
                        deletedAt: null,
                    },
                    {
                        id: "056cce23-0247-4bce-b973-dfe57e7cac7b",
                        name: "Eko Prasetyo",
                        telp: "081298765005",
                        birthDate: 558576000000,
                        city: "Jakarta",
                        province: "DKI Jakarta",
                        subdistrict: "Kuningan",
                        ward: "Kuningan Barat",
                        postalCode: "12710",
                        fullAddress: "Jl. Kuningan Barat No. 7, Mampang Prapatan, Jakarta Selatan",
                        shortAddress: "Jl. Kuningan Barat No. 7",
                        createdAt: "2026-01-17T20:02:44.600Z",
                        updatedAt: "2026-01-17T20:02:44.600Z",
                        deletedAt: null,
                    },
                    {
                        id: "c9910194-8449-491a-9d54-eb39e5daf3a4",
                        name: "Dewi Kusuma",
                        telp: "081298765004",
                        birthDate: 642124800000,
                        city: "Jakarta",
                        province: "DKI Jakarta",
                        subdistrict: "Kemang",
                        ward: "Bangka",
                        postalCode: "12730",
                        fullAddress: "Jl. Kemang Raya No. 23, Mampang Prapatan, Jakarta Selatan",
                        shortAddress: "Jl. Kemang Raya No. 23",
                        createdAt: "2026-01-17T20:02:44.599Z",
                        updatedAt: "2026-01-17T20:02:44.599Z",
                        deletedAt: null,
                    },
                    {
                        id: "8d3b3d0d-4c32-4847-9101-31bff2846d6a",
                        name: "Budi Hartono",
                        telp: "081298765003",
                        birthDate: 501724800000,
                        city: "Jakarta",
                        province: "DKI Jakarta",
                        subdistrict: "Tebet",
                        ward: "Tebet Barat",
                        postalCode: "12810",
                        fullAddress: "Jl. Tebet Barat Dalam No. 88, Tebet, Jakarta Selatan",
                        shortAddress: "Jl. Tebet Barat Dalam No. 88",
                        createdAt: "2026-01-17T20:02:44.597Z",
                        updatedAt: "2026-01-17T20:02:44.597Z",
                        deletedAt: null,
                    },
                    {
                        id: "4b464a0a-cb65-4a72-963d-3cb19335ea8a",
                        name: "Sari Lestari",
                        telp: "081298765002",
                        birthDate: 711417600000,
                        city: "Jakarta",
                        province: "DKI Jakarta",
                        subdistrict: "Kebayoran Baru",
                        ward: "Senayan",
                        postalCode: "12190",
                        fullAddress: "Jl. Senopati No. 12, Kebayoran Baru, Jakarta Selatan",
                        shortAddress: "Jl. Senopati No. 12",
                        createdAt: "2026-01-17T20:02:44.596Z",
                        updatedAt: "2026-01-17T20:02:44.596Z",
                        deletedAt: null,
                    },
                    {
                        id: "63d0d951-3fd9-432b-b02a-d9f1c7f49e66",
                        name: "Andi Wijaya",
                        telp: "081298765001",
                        birthDate: 574128000000,
                        city: "Jakarta",
                        province: "DKI Jakarta",
                        subdistrict: "Menteng",
                        ward: "Menteng",
                        postalCode: "10310",
                        fullAddress: "Jl. Menteng Raya No. 45, Menteng, Jakarta Pusat",
                        shortAddress: "Jl. Menteng Raya No. 45",
                        createdAt: "2026-01-17T20:02:44.594Z",
                        updatedAt: "2026-01-17T20:02:44.594Z",
                        deletedAt: null,
                    },
                ];

                if (!query) {
                    resolve(allCustomers);
                    return;
                }

                const filtered = allCustomers.filter(customer =>
                    customer.name.toLowerCase().includes(query.toLowerCase()) ||
                    customer.city.toLowerCase().includes(query.toLowerCase()) ||
                    customer.telp.includes(query) ||
                    customer.fullAddress.toLowerCase().includes(query.toLowerCase())
                );

                resolve(filtered);
            }, 500);
        });
    }
}
