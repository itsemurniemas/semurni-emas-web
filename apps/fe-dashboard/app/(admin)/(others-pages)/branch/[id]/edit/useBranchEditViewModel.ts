import { useState, useEffect } from "react";
import {
    GetBranchById,
    UpdateBranch,
    BranchModel,
    DataViewState,
    prepareBranchRequest,
} from "@repo/core";
import type { BranchFormData, UpdateBranchRequest } from "@repo/core/use-cases/branch/BranchRequestModel";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";

export type { BranchFormData } from "@repo/core/use-cases/branch/BranchRequestModel";

export const useBranchEditViewModel = (branchId: string) => {
    const { user } = useAuth();
    const [state, setState] = useState<DataViewState<BranchModel>>(
        DataViewState.initiate()
    );
    const [formData, setFormData] = useState<BranchFormData | null>(null);
    const [initialData, setInitialData] = useState<BranchFormData | null>(null);

    // Fetch branch data on mount
    useEffect(() => {
        const fetchBranchData = async () => {
            setState(DataViewState.loading());
            try {
                const useCase = new GetBranchById(getApiConfigForRole(user?.role || null));
                const data: BranchModel = await useCase.execute(branchId);
                setState(DataViewState.success(data));
                setFormData({
                    name: data.name || "",
                    telp: data.telp || "",
                    city: data.city || "",
                    province: data.province || "",
                    subdistrict: (data as any).subdistrict || data.subDistrict || "",
                    ward: (data as any).ward || "",
                    postalCode: (data as any).postalCode || "",
                    shortAddress: (data as any).shortAddress || data.streetName || "",
                    area: data.area || "",
                    latitude: data.latitude?.toString() || "",
                    longitude: data.longitude?.toString() || "",
                    weekdays: data.operatingHours?.weekdays || null,
                    saturday: data.operatingHours?.saturday || null,
                    sunday: data.operatingHours?.sunday || null,
                    holidays: data.operatingHours?.holidays || null,
                });
                
                setInitialData({
                    name: data.name || "",
                    telp: data.telp || "",
                    city: data.city || "",
                    province: data.province || "",
                    subdistrict: (data as any).subdistrict || data.subDistrict || "",
                    ward: (data as any).ward || "",
                    postalCode: (data as any).postalCode || "",
                    shortAddress: (data as any).shortAddress || data.streetName || "",
                    area: data.area || "",
                    latitude: data.latitude?.toString() || "",
                    longitude: data.longitude?.toString() || "",
                    weekdays: data.operatingHours?.weekdays || null,
                    saturday: data.operatingHours?.saturday || null,
                    sunday: data.operatingHours?.sunday || null,
                    holidays: data.operatingHours?.holidays || null,
                });
            } catch (error) {
                console.error("Failed to fetch branch data:", error);
                setState(DataViewState.error(error instanceof Error ? error.message : "Unknown error"));
            }
        };

        fetchBranchData();
    }, [branchId, user?.role]);

    const updateFormData = (updates: Partial<BranchFormData>) => {
        setFormData((prev: BranchFormData | null) => prev ? { ...prev, ...updates } : null);
    };

    const submitBranchData = async (branchId: string): Promise<boolean> => {
        if (!formData || !initialData) return false;

        try {
            const updateUseCase = new UpdateBranch(getApiConfigForRole(user?.role || null));
            
            // Only send changed fields
            const changedFields: Record<string, any> = {};
            (Object.keys(formData) as Array<keyof BranchFormData>).forEach((key: keyof BranchFormData) => {
                if (formData[key] !== initialData[key]) {
                    changedFields[key as string] = formData[key];
                }
            });

            // If no changes, return success without making request
            if (Object.keys(changedFields).length === 0) {
                return true;
            }

            const submitData: any = prepareBranchRequest({ ...formData } as BranchFormData);
            // Only include changed fields in the request
            const changedSubmitData: Record<string, any> = {};
            Object.keys(changedFields).forEach((key) => {
                if (key in submitData) {
                    changedSubmitData[key] = submitData[key];
                }
            });

            await updateUseCase.execute(changedSubmitData as UpdateBranchRequest, branchId);
            return true;
        } catch (error) {
            console.error("Failed to update branch:", error);
            return false;
        }
    };

    return {
        state,
        formData,
        initialData,
        updateFormData,
        submitBranchData,
    };
};
