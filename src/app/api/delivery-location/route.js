import { NextResponse } from 'next/server';
import {
  createDeliveryLocation,
  getDeliveryLocations,
  getDeliveryLocation,
  updateDeliveryLocation,
  deleteDeliveryLocation,
  toggleDeliveryLocationStatus
} from '@/app/server/controllers/deliveryLocationController';

/**
 * POST /api/delivery-location
 * Create a new delivery location
 */
export async function POST(req) {
  try {
    return await createDeliveryLocation(req);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/delivery-location
 * Get all delivery locations
 */
export async function GET(req) {
  try {
    return await getDeliveryLocations(req);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
