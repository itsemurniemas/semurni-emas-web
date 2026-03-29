"use client";

import BranchCard from "@/components/branch/BranchCard";
import PageHeader from "@/components/ui/PageHeader";
import { useBranchViewModel } from "./useBranchViewModel";

const BranchesPage = () => {
  const { state } = useBranchViewModel();

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 pb-24 section-container">
        {/* Page Header */}
        <PageHeader
          title="Cabang Kami"
          description="Temukan toko Semurni Emas terdekat"
        />

        {/* Branch Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.type === "loading" || state.type === "initiate" ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-100 w-full bg-muted animate-pulse rounded-lg"
              />
            ))
          ) : state.type === "error" ? (
            <div className="col-span-full py-12 text-center text-destructive">
              Gagal memuat daftar cabang: {state.message}
            </div>
          ) : (
            state.data.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default BranchesPage;
