import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { BranchModel } from "@repo/core";

interface BranchListTableProps {
  items: BranchModel[];
}

const BranchListTable: React.FC<BranchListTableProps> = ({ items }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400 sm:px-5"
              >
                Nama Cabang
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400 sm:px-5"
              >
                Kota
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 text-end text-theme-sm dark:text-gray-400 sm:px-5"
              >
                Jumlah Karyawan
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {items.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="px-4 py-3 text-start sm:px-5 sm:py-4">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {account.name}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400 sm:px-5">
                  {account.city}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400 sm:px-5">
                  {account.employeeCount} Karyawan
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export const BranchListShimmer: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400 sm:px-5"
              >
                Nama Cabang
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400 sm:px-5"
              >
                Kota
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 text-end text-theme-sm dark:text-gray-400 sm:px-5"
              >
                Jumlah Karyawan
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell className="px-4 py-3 sm:px-5 sm:py-4">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-white/5"></div>
                </TableCell>
                <TableCell className="px-4 py-3 sm:px-5">
                  <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-white/5"></div>
                </TableCell>
                <TableCell className="px-4 py-3 sm:px-5">
                  <div className="ml-auto h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-white/5"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BranchListTable;
