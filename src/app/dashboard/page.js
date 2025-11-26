"use client";
import React from "react";
import DashboardStats from "@/components/dashboard-component/DashboardStats";
import DashboardWelcome from "@/components/dashboard-component/DashboardWelcome";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function Dashboard() {
  return (
    <>
    <ProtectedRoute allowedRoles={['admin', 'customer']}>
      <DashboardWelcome />
    </ProtectedRoute>
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardStats />
    </ProtectedRoute>
    </>
  );
}
