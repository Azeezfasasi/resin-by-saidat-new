import { NextResponse } from 'next/server';
import {
  getDeliveryLocation,
  updateDeliveryLocation,
  deleteDeliveryLocation,
  toggleDeliveryLocationStatus
} from '@/app/server/controllers/deliveryLocationController';

/**
 * GET /api/delivery-location/[id]
 * Get a single delivery location
 */
export async function GET(req, { params }) {
  try {
    return await getDeliveryLocation(req, { params });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/delivery-location/[id]
 * Update a delivery location
 */
export async function PUT(req, { params }) {
  try {
    return await updateDeliveryLocation(req, { params });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/delivery-location/[id]
 * Delete a delivery location
 */
export async function DELETE(req, { params }) {
  try {
    return await deleteDeliveryLocation(req, { params });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/delivery-location/[id]/toggle
 * Toggle delivery location active status
 */
export async function PATCH(req, { params }) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get('action') === 'toggle') {
      return await toggleDeliveryLocationStatus(req, { params });
    }
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
