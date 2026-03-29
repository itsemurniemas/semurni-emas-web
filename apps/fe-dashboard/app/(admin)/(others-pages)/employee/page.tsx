"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useMemo } from "react";
import EmployeeListTable, {
  EmployeeListShimmer,
} from "@/components/employee/EmployeeListTable";
import { useEmployeeListViewModel } from "./useEmployeeListViewModel";
import { Search } from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";

const EmployeeListPage: React.FC = () => {
  const { state } = useEmployeeListViewModel();
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredData = useMemo(() => {
    if (state.type !== "success" || !searchTerm.trim()) {
      return state.type === "success" ? state.data : [];
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    return state.data
      .map((branch) => ({
        ...branch,
        employees: branch.employees.filter(
          (emp) =>
            emp.name.toLowerCase().includes(lowerSearchTerm) ||
            emp.telp.includes(searchTerm) ||
            emp.fullAddress?.toLowerCase().includes(lowerSearchTerm) ||
            emp.shortAddress?.toLowerCase().includes(lowerSearchTerm),
        ),
      }))
      .filter((branch) => branch.employees.length > 0);
  }, [state, searchTerm]);

  const mappedData = useMemo(() => {
    return filteredData.map((branch) => ({
      ...branch,
      employees: branch.employees.map((emp) => ({
        id: emp.id,
        fullName: emp.name,
        phone: emp.telp,
        avgRating: emp.avgRating || null,
        email: "",
        role: emp.positionName || "",
        status: "Active" as const,
        address: emp.fullAddress || emp.shortAddress || "",
        joinDate: emp.createdAt,
      })),
    }));
  }, [filteredData]);

  const renderContent = () => {
    switch (state.type) {
      case "initiate":
      case "loading":
        return <EmployeeListShimmer />;
      case "error":
        return (
          <div className="flex items-center justify-center p-10 bg-white rounded-2xl border border-red-200 dark:border-red-800 dark:bg-red-900/10">
            <p className="text-red-500">Error: {state.message}</p>
          </div>
        );
      case "success":
        return (
          <div className="space-y-6">
            {mappedData.map((item) => (
              <ComponentCard
                title={`${item.name} (${item.employees.length} Karyawan)`}
                key={item.id}
              >
                <EmployeeListTable items={item.employees} />
              </ComponentCard>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb pageTitle="Daftar Karyawan" />

        <div className="relative w-full sm:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Cari karyawan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-theme-sm outline-none transition focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>
      </div>

      <div>{renderContent()}</div>
    </div>
  );
};

export default EmployeeListPage;
