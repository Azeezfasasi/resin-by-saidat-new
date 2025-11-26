"use client";
import React from "react";
import DashboardStats from "@/components/dashboard-component/DashboardStats";
import DashboardWelcome from "@/components/dashboard-component/DashboardWelcome";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['admin', 'customer', 'staff-member']}>
      <DashboardWelcome />
      
      {/* Show DashboardStats only for admin and staff */}
      {user?.role === 'admin' || user?.role === 'staff-member' ? (
        <DashboardStats />
      ) : null}
    </ProtectedRoute>
  );
}
