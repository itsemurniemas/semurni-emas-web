import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/account/AccountListTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Basic Table | Semurni Emas Dashboard",
  description: "This is Basic Table  page for Semurni Emas Dashboard",
  // other metadata
};

import { MOCK_ACCOUNT_DATA_1 } from "@/components/account/data";

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Basic Table" />
      <div className="space-y-6">
        <ComponentCard title="Basic Table 1">
          <BasicTableOne items={MOCK_ACCOUNT_DATA_1} />
        </ComponentCard>
      </div>
    </div>
  );
}
