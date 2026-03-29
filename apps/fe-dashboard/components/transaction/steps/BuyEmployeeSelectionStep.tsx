"use client";
import React, { useEffect, useState } from "react";
import MultiSelect from "@/components/form/MultiSelect";
import Label from "@/components/form/Label";
import { DataViewState, EmployeeModel, BranchModel } from "@repo/core";

interface EmployeeSelectionStepProps {
  selected: string[];
  employeeState: DataViewState<any>;
  branchId: string | undefined;
  onSelect: (employeeIds: string[]) => void;
  isSuperAdmin: boolean;
}

const BuyEmployeeSelectionStep: React.FC<EmployeeSelectionStepProps> = ({
  selected,
  employeeState,
  branchId,
  onSelect,
  isSuperAdmin,
}) => {
  const [employeeOptions, setEmployeeOptions] = useState<
    Array<{ value: string; text: string; selected: boolean }>
  >([]);

  useEffect(() => {
    if (employeeState.type === "success" && employeeState.data) {
      if (isSuperAdmin && branchId) {
        // Filter employees for the selected branch only
        const selectedBranch = employeeState.data.find(
          (branch: any) => branch.id === branchId,
        );
        const options: Array<{
          value: string;
          text: string;
          selected: boolean;
        }> = [];
        if (selectedBranch) {
          selectedBranch.employees.forEach((employee: any) => {
            options.push({
              value: employee.id,
              text: employee.name,
              selected: selected.includes(employee.id),
            });
          });
        }
        setEmployeeOptions(options);
      } else if (!isSuperAdmin) {
        // Show all employees for non-SUPER_ADMIN users
        const options: Array<{
          value: string;
          text: string;
          selected: boolean;
        }> = [];
        employeeState.data.forEach((branch: any) => {
          branch.employees.forEach((employee: any) => {
            options.push({
              value: employee.id,
              text: `${employee.name} (${branch.name})`,
              selected: selected.includes(employee.id),
            });
          });
        });
        setEmployeeOptions(options);
      } else {
        // SUPER_ADMIN but no branch selected
        setEmployeeOptions([]);
      }
    }
  }, [employeeState, isSuperAdmin, branchId, selected]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pilih Karyawan
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Pilih karyawan yang menangani transaksi pembelian ini. Minimal satu
            karyawan harus dipilih.
          </p>
        </div>

        {/* Employee Selection */}
        <div>
          <Label htmlFor="employee">Karyawan</Label>
          <MultiSelect
            options={employeeOptions}
            onChange={onSelect}
            placeholder={
              isSuperAdmin && !branchId
                ? "Pilih cabang terlebih dahulu"
                : "Pilih karyawan yang menangani"
            }
          />
        </div>

        {/* Selected Employees Info */}
        {selected.length > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm font-medium text-green-900 dark:text-green-300">
              <span className="font-semibold">Karyawan Terpilih:</span>{" "}
              {selected.length > 0 && (
                <span>
                  {employeeOptions
                    .filter((e) => selected.includes(e.value))
                    .map((e) => e.text)
                    .join(", ")}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyEmployeeSelectionStep;
