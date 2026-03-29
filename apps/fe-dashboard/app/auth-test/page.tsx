"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthTestPage() {
  const { user, login, logout, isLoading, isAuthenticated } = useAuth();

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-bold">Auth Context verification</h1>

      <div className="border p-4 rounded">
        <p>
          <strong>Is Loading:</strong> {isLoading ? "Yes" : "No"}
        </p>
        <p>
          <strong>Is Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
        </p>
        <p>
          <strong>User:</strong> {user ? JSON.stringify(user, null, 2) : "null"}
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => login("super_admin", "password")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login as Super Admin
        </button>
        <button
          onClick={() => login("admin", "password")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Login as Admin
        </button>
        <button
          onClick={() => login("cashier", "password")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Login as Cashier
        </button>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
