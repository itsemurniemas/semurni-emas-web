import React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { EmployeeProps } from "./data";
import { EmployeeModel } from "@repo/core";
import { Star } from "lucide-react";

interface EmployeeListTableProps {
  items: (EmployeeProps | EmployeeModel)[];
}

const EmployeeListTable: React.FC<EmployeeListTableProps> = ({ items }) => {
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
                Nama
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400 sm:px-5"
              >
                No. Ponsel
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400 sm:px-5"
              >
                Posisi
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 text-end text-theme-sm dark:text-gray-400 sm:px-5"
              >
                Rating
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {items.map((account) => {
              const fullName =
                "fullName" in account ? account.fullName : account.name;
              const phone = "phone" in account ? account.phone : account.telp;
              const role = "role" in account ? account.role : "-";
              const rating =
                "avgRating" in account ? account.avgRating : account.avgRating;

              return (
                <TableRow key={account.id}>
                  <TableCell className="px-4 py-3 text-start sm:px-5 sm:py-4">
                    <Link
                      href={`/employee/detail/${account.id}`}
                      className="block font-medium text-gray-800 hover:text-brand-500 text-theme-sm dark:text-white/90 dark:hover:text-brand-400"
                    >
                      {fullName}
                    </Link>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400 sm:px-5">
                    {phone}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400 sm:px-5">
                    {role}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400 sm:px-5">
                    {rating != null ? renderStars(rating) : "N/A"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const renderStars = (rating: number) => {
  return (
    <div className="flex items-center justify-end gap-1">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const isFull = rating >= starValue;
        const isHalf = !isFull && rating >= starValue - 0.5;

        return (
          <div key={index} className="relative">
            <Star
              className={`size-6 ${
                isFull
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
            {isHalf && (
              <div className="absolute top-0 left-0 overflow-hidden w-3 h-6">
                <Star className="size-6 fill-yellow-400 text-yellow-400" />
              </div>
            )}
          </div>
        );
      })}
      <span className="ml-2 text-xs font-medium text-gray-500">
        ({rating.toFixed(1)})
      </span>
    </div>
  );
};

export const EmployeeListShimmer: React.FC = () => {
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
                Nama
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400 sm:px-5"
              >
                No. Ponsel
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 text-end text-theme-sm dark:text-gray-400 sm:px-5"
              >
                Jabatan
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 text-end text-theme-sm dark:text-gray-400 sm:px-5"
              >
                Rating
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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

export default EmployeeListTable;
