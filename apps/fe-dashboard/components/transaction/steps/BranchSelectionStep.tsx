"use client";
import React, { useEffect, useState } from "react";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import { BranchModel, DataViewState } from "@repo/core";

interface BranchSelectionStepProps {
  selected: string | undefined;
  branchListState: DataViewState<BranchModel[]>;
  onSelect: (branchId: string | undefined) => void;
  isSuperAdmin: boolean;
}

const BranchSelectionStep: React.FC<BranchSelectionStepProps> = ({
  selected,
  branchListState,
  onSelect,
  isSuperAdmin,
}) => {
  const [branchOptions, setBranchOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  useEffect(() => {
    if (
      isSuperAdmin &&
      branchListState.type === "success" &&
      branchListState.data
    ) {
      setBranchOptions(
        branchListState.data.map((branch) => ({
          value: branch.id,
          label: branch.name,
        })),
      );
    }
  }, [branchListState, isSuperAdmin]);

  if (!isSuperAdmin) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Cabang sudah otomatis dipilih berdasarkan akun Anda. Transaksi yang
            dibuat akan tercatat untuk cabang tersebut.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pilih Cabang
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Pilih cabang untuk transaksi penjualan ini. Semua item akan dicatat
            untuk cabang yang dipilih.
          </p>
        </div>

        {/* Branch Selection */}
        <div>
          <Label htmlFor="branch">Cabang</Label>
          <Select
            options={branchOptions}
            value={selected || ""}
            onChange={(value) => onSelect(value || undefined)}
            placeholder="Pilih cabang"
          />
        </div>

        {/* Selected Branch Info */}
        {selected && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm font-medium text-green-900 dark:text-green-300">
              <span className="font-semibold">Cabang Terpilih:</span>{" "}
              {branchOptions.find((opt) => opt.value === selected)?.label}
            </p>
          </div>
        )}

        {/* Error State */}
        {branchListState.type === "error" && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-700 dark:text-red-400">
              Error: {branchListState.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchSelectionStep;
