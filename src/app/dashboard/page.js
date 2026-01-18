"use client";
import React from "react";
import DashboardStats from "@/components/dashboard-component/DashboardStats";
import DashboardWelcome from "@/components/dashboard-component/DashboardWelcome";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Commet } from "react-loading-indicators";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { user } = useAuth();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Commet color="#155dfc" size="medium" text="Loading" textColor="#155dfc" /></div>;
  }
  if (!isAuthenticated) {
    return null;
  }

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
