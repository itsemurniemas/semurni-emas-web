"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import EmployeeCard from "@/components/employee/EmployeeCard";
import CapsulePicker from "@/components/ui/CapsulePicker";
import { Button } from "@/components/ui/button";
import { useEmployeeListViewModel } from "./useEmployeeListViewModel";

const EmployeesPage = () => {
  const router = useRouter();
  const { state } = useEmployeeListViewModel();
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  const branchOptions = useMemo(() => {
    if (state.type !== "success")
      return [{ label: "Semua Cabang", value: "all" }];

    const branches = state.data.map((b) => ({
      label: b.name,
      value: b.id,
    }));

    return [{ label: "Semua Cabang", value: "all" }, ...branches];
  }, [state]);

  const filteredEmployees = useMemo(() => {
    if (state.type !== "success") return [];

    if (selectedBranch === "all") {
      return state.data.flatMap((branch) =>
        branch.employees.map((emp) => ({
          ...emp,
          branchName: branch.name,
          branchId: branch.id,
        })),
      );
    }

    const branch = state.data.find((b) => b.id === selectedBranch);
    if (!branch) return [];

    return branch.employees.map((emp) => ({
      ...emp,
      branchName: branch.name,
      branchId: branch.id,
    }));
  }, [state, selectedBranch]);

  const renderContent = () => {
    switch (state.type) {
      case "initiate":
      case "loading":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-lg p-5 flex flex-col items-center animate-pulse"
              >
                <div className="w-20 h-20 bg-muted rounded-full mb-4"></div>
                <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                <div className="h-3 bg-muted rounded w-32 mb-3"></div>
                <div className="h-3 bg-muted rounded w-20 mb-3"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </div>
            ))}
          </div>
        );
      case "error":
        return (
          <div className="py-12 text-center">
            <p className="text-destructive">
              Gagal memuat data tim: {state.message}
            </p>
          </div>
        );
      case "success":
        return (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <p className="text-sm font-light text-muted-foreground">
                Menampilkan {filteredEmployees.length} anggota tim
              </p>
              <Button
                onClick={() => router.push("/rate-employees")}
                variant="default"
                className="w-full sm:w-auto"
              >
                Beri Ulasan Karyawan
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  branchName={employee.name}
                />
              ))}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] bg-background">
      <main className="py-16 section-container">
        {/* Page Header */}
        <PageHeader
          title="Tim Kami"
          description="Kenali para profesional di Semurni Emas"
        />

        {/* Branch Filter and Review Button */}
        <div className="mb-8">
          <CapsulePicker
            options={branchOptions}
            value={selectedBranch}
            onChange={setSelectedBranch}
          />
        </div>

        {/* Employee Content */}
        <div>{renderContent()}</div>
      </main>
    </div>
  );
};

export default EmployeesPage;
