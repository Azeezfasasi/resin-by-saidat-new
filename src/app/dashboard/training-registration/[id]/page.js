import React from 'react';
import TrainingRegistrationDetail from '@/components/dashboard/training/TrainingRegistrationDetail';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default async function TrainingRegistrationDetailPage({ params }) {
  const { id } = await params;
  return (
    <ProtectedRoute allowedRoles={['admin', 'staff-member']}>
      <TrainingRegistrationDetail id={id} />
    </ProtectedRoute>
  );
}
