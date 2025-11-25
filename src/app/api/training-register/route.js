import { connectDB } from '@/utils/db';
import {
  createRegistration,
  getAllRegistrations,
  getRegistrationStats,
} from '@/app/server/controllers/trainingController';

// POST: Create new registration
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const result = await createRegistration(body);

    if (!result.success) {
      return Response.json(
        { message: result.error },
        { status: result.statusCode || 500 }
      );
    }

    return Response.json(
      {
        message: 'Registration successful',
        data: result.data,
      },
      { status: result.statusCode }
    );
  } catch (error) {
    console.error('Training registration error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Fetch all registrations or statistics
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const stats = searchParams.get('stats');

    // If stats=true, return statistics
    if (stats === 'true') {
      const result = await getRegistrationStats();

      if (!result.success) {
        return Response.json(
          { message: result.error },
          { status: 500 }
        );
      }

      return Response.json(result, { status: 200 });
    }

    // Otherwise return paginated registrations
    const query = Object.fromEntries(searchParams);
    const result = await getAllRegistrations({ query });

    if (!result.success) {
      return Response.json(
        { message: result.error },
        { status: 500 }
      );
    }

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
