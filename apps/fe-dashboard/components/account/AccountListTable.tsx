"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { AccountProps } from "./data";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import Button from "../ui/button/Button";
import { AlertDialogDrawer } from "../dialogDrawer";
import { DeleteUser } from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";
import { toast } from "react-toastify";

interface AccountListTableProps {
  items: AccountProps[];
  onDeleteSuccess?: () => void;
}

const AccountListTable: React.FC<AccountListTableProps> = ({
  items,
  onDeleteSuccess,
}) => {
  const { user } = useAuth();
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  );
  const [selectedAccountUsername, setSelectedAccountUsername] =
    useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (accountId: string, username: string) => {
    setSelectedAccountId(accountId);
    setSelectedAccountUsername(username);
    setOpenDeleteAlert(true);
  };

  const handleDelete = async () => {
    if (!selectedAccountId) return;

    setIsDeleting(true);
    try {
      const useCase = new DeleteUser(getApiConfigForRole(user?.role || null));
      await useCase.execute(selectedAccountId);
      toast.success("Akun berhasil dihapus");
      setOpenDeleteAlert(false);
      setSelectedAccountId(null);
      setSelectedAccountUsername("");
      onDeleteSuccess?.();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus akun",
      );
      setOpenDeleteAlert(false);
    } finally {
      setIsDeleting(false);
    }
  };
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
                Akun
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400 sm:px-5"
              >
                Role
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 text-end text-theme-sm dark:text-gray-400 sm:px-5"
              >
                Aksi
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {items.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="px-4 py-3 text-start sm:px-5 sm:py-4">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {account.username}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400 sm:px-5">
                  {account.role}
                </TableCell>
                <TableCell className="px-4 py-3 text-end sm:px-5">
                  <div className="flex justify-end gap-2">
                    <Link href={`/account/edit/${account.id}`}>
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex items-center gap-1 w-auto h-8"
                      >
                        <Edit size={16} />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="error"
                      size="sm"
                      className="flex items-center gap-1 w-auto h-8"
                      onClick={() =>
                        handleDeleteClick(account.id, account.username)
                      }
                    >
                      <Trash2 size={16} />
                      Hapus
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialogDrawer
        open={openDeleteAlert}
        setOpen={setOpenDeleteAlert}
        type="warning"
        title="Hapus Akun"
        description={`Apakah Anda yakin ingin menghapus akun ${selectedAccountUsername}? Tindakan ini tidak dapat dibatalkan.`}
        buttonText="Hapus"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AccountListTable;
