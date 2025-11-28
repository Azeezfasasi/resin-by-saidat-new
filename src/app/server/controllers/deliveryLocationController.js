import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import DeliveryLocation from '@/app/server/models/DeliveryLocation';

/**
 * CREATE DELIVERY LOCATION
 * POST /api/delivery-location
 */
export const createDeliveryLocation = async (req) => {
  try {
    await connectDB();
    const body = await req.json();
    const { name, shippingCost, estimatedDays, description, coverageAreas } = body;

    // Validate required fields
    if (!name || shippingCost === undefined || !estimatedDays) {
      return NextResponse.json(
        { error: 'Name, shipping cost, and estimated days are required' },
        { status: 400 }
      );
    }

    // Check if location already exists
    const existing = await DeliveryLocation.findOne({ name });
    if (existing) {
      return NextResponse.json(
        { error: 'Delivery location with this name already exists' },
        { status: 409 }
      );
    }

    const location = await DeliveryLocation.create({
      name,
      shippingCost: parseFloat(shippingCost),
      estimatedDays: parseInt(estimatedDays),
      description,
      coverageAreas: coverageAreas || [],
      createdBy: req.user?.id,
      isActive: true
    });

    return NextResponse.json(
      { message: 'Delivery location created successfully', location },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating delivery location:', error);
    return NextResponse.json(
      { error: 'Failed to create delivery location', details: error.message },
      { status: 500 }
    );
  }
};

/**
 * GET ALL DELIVERY LOCATIONS
 * GET /api/delivery-location
 */
export const getDeliveryLocations = async (req) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';

    let query = {};
    if (activeOnly) {
      query.isActive = true;
    }

    const locations = await DeliveryLocation.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ name: 1 });

    return NextResponse.json({ locations });
  } catch (error) {
    console.error('Error fetching delivery locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch delivery locations', details: error.message },
      { status: 500 }
    );
  }
};

/**
 * GET SINGLE DELIVERY LOCATION
 * GET /api/delivery-location/[id]
 */
export const getDeliveryLocation = async (req, { params }) => {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 }
      );
    }

    const location = await DeliveryLocation.findById(id).populate('createdBy', 'firstName lastName');

    if (!location) {
      return NextResponse.json(
        { error: 'Delivery location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ location });
  } catch (error) {
    console.error('Error fetching delivery location:', error);
    return NextResponse.json(
      { error: 'Failed to fetch delivery location', details: error.message },
      { status: 500 }
    );
  }
};

/**
 * UPDATE DELIVERY LOCATION
 * PUT /api/delivery-location/[id]
 */
export const updateDeliveryLocation = async (req, { params }) => {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const { name, shippingCost, estimatedDays, description, coverageAreas, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 }
      );
    }

    // Check if another location has the same name
    if (name) {
      const existing = await DeliveryLocation.findOne({ name, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json(
          { error: 'Another delivery location with this name already exists' },
          { status: 409 }
        );
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (shippingCost !== undefined) updateData.shippingCost = parseFloat(shippingCost);
    if (estimatedDays) updateData.estimatedDays = parseInt(estimatedDays);
    if (description !== undefined) updateData.description = description;
    if (coverageAreas) updateData.coverageAreas = coverageAreas;
    if (isActive !== undefined) updateData.isActive = isActive;
    updateData.updatedAt = new Date();

    const location = await DeliveryLocation.findByIdAndUpdate(id, updateData, { new: true })
      .populate('createdBy', 'firstName lastName');

    if (!location) {
      return NextResponse.json(
        { error: 'Delivery location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Delivery location updated successfully', location }
    );
  } catch (error) {
    console.error('Error updating delivery location:', error);
    return NextResponse.json(
      { error: 'Failed to update delivery location', details: error.message },
      { status: 500 }
    );
  }
};

/**
 * DELETE DELIVERY LOCATION
 * DELETE /api/delivery-location/[id]
 */
export const deleteDeliveryLocation = async (req, { params }) => {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 }
      );
    }

    const location = await DeliveryLocation.findByIdAndDelete(id);

    if (!location) {
      return NextResponse.json(
        { error: 'Delivery location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Delivery location deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting delivery location:', error);
    return NextResponse.json(
      { error: 'Failed to delete delivery location', details: error.message },
      { status: 500 }
    );
  }
};

/**
 * TOGGLE DELIVERY LOCATION ACTIVE STATUS
 * PATCH /api/delivery-location/[id]/toggle
 */
export const toggleDeliveryLocationStatus = async (req, { params }) => {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 }
      );
    }

    const location = await DeliveryLocation.findById(id);

    if (!location) {
      return NextResponse.json(
        { error: 'Delivery location not found' },
        { status: 404 }
      );
    }

    location.isActive = !location.isActive;
    location.updatedAt = new Date();
    await location.save();

    return NextResponse.json(
      { message: `Delivery location ${location.isActive ? 'activated' : 'deactivated'}`, location }
    );
  } catch (error) {
    console.error('Error toggling delivery location status:', error);
    return NextResponse.json(
      { error: 'Failed to toggle delivery location status', details: error.message },
      { status: 500 }
    );
  }
};
