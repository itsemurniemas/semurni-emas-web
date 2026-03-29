"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function handleLogout() {
    logout();
    router.push("/signin");
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        <span className="block mr-1 font-medium text-theme-sm">
          Hai, {user?.username || "User"}
        </span>

        <ChevronDown
          size={18}
          className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[200px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <LogOut
            size={20}
            className="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
          />
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
