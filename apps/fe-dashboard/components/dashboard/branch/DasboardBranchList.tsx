"use client";

import { DasboardListItemProps } from "./data";

interface DashboardBranchListProps {
  items: DasboardListItemProps[];
}

const DashboardBranchList: React.FC<DashboardBranchListProps> = ({ items }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        Daftar Cabang
      </h3>

      <div className="space-y-5 pt-4">
        {items.map((branch, index) => (
          <DashboardBranchListCard key={index} {...branch} />
        ))}
      </div>
    </div>
  );
};

const DashboardBranchListCard: React.FC<DasboardListItemProps> = ({
  name,
  employees,
}) => {
  return (
    <div className="flex items-center justify-between">
      <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
        {name}
      </p>
      <p className="block text-gray-500 text-theme-xs dark:text-gray-400">
        {employees} Karyawan
      </p>
    </div>
  );
};

export default DashboardBranchList;
