"use client";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useLogsViewModel, ActivityLog } from "./useLogsViewModel";
import { LoaderCircle } from "lucide-react";
import Pagination from "@/components/tables/Pagination";

const LogsPage: React.FC = () => {
  const { state, pagination, goToPage } = useLogsViewModel();

  const formatActionBadge = (action: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> =
      {
        CREATE: { bg: "bg-green-100", text: "text-green-800", label: "Buat" },
        UPDATE: { bg: "bg-blue-100", text: "text-blue-800", label: "Ubah" },
        DELETE: { bg: "bg-red-100", text: "text-red-800", label: "Hapus" },
        READ: { bg: "bg-gray-100", text: "text-gray-800", label: "Baca" },
      };

    const style = styles[action] || styles.READ;
    return (
      <span
        className={`inline-block px-2 py-1 rounded text-sm font-medium ${style.bg} ${style.text}`}
      >
        {style.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  if (state.type === "loading" || state.type === "initiate") {
    return (
      <div>
        <PageBreadcrumb pageTitle="Activity Logs" />
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Memuat activity logs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (state.type === "error") {
    return (
      <div>
        <PageBreadcrumb pageTitle="Activity Logs" />
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400">
            Error loading logs: {state.message}
          </p>
        </div>
      </div>
    );
  }

  const logs: ActivityLog[] = state.type === "success" ? state.data : [];

  return (
    <div>
      <PageBreadcrumb pageTitle="Activity Logs" />

      {/* Logs Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Entity
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-6 py-4 text-sm">
                      {formatActionBadge(log.action)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      {log.entity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {log.message}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {log.user.username}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(log.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tidak ada activity logs
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}
    </div>
  );
};

export default LogsPage;
