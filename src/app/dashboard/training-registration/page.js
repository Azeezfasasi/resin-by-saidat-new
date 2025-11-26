import React from 'react';
import AllTrainingRegistrationList from '@/components/dashboard/training/AllTrainingRegistrationList';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AllTrainingRegistration() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'staff-member']}>
      <AllTrainingRegistrationList />
    </ProtectedRoute>
  );
}
