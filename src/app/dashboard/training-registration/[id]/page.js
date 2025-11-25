import React from 'react';
import TrainingRegistrationDetail from '@/components/dashboard/training/TrainingRegistrationDetail';

export default async function TrainingRegistrationDetailPage({ params }) {
  const { id } = await params;
  return <TrainingRegistrationDetail id={id} />;
}
