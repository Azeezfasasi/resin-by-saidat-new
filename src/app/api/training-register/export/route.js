import { connectDB } from '@/utils/db';
import { exportRegistrations } from '@/app/server/controllers/trainingController';

// GET: Export registrations as CSV
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const filters = {
      status: searchParams.get('status'),
      sessionDate: searchParams.get('sessionDate'),
    };

    // Remove null values from filters
    Object.keys(filters).forEach(key =>
      filters[key] === null && delete filters[key]
    );

    const result = await exportRegistrations(filters);

    if (!result.success) {
      return Response.json(
        { message: result.error },
        { status: 500 }
      );
    }

    // Generate CSV content
    const csvData = result.data;
    if (csvData.length === 0) {
      return Response.json(
        { message: 'No registrations to export' },
        { status: 404 }
      );
    }

    // Get headers from first object
    const headers = Object.keys(csvData[0]);

    // Create CSV string
    const csvString =
      headers.join(',') +
      '\n' +
      csvData
        .map(row =>
          headers
            .map(header => {
              const value = row[header];
              // Escape quotes and wrap in quotes if contains comma
              if (typeof value === 'string' && value.includes(',')) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value;
            })
            .join(',')
        )
        .join('\n');

    // Return as CSV file
    return new Response(csvString, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition':
          'attachment; filename="training-registrations.csv"',
      },
    });
  } catch (error) {
    console.error('Error exporting registrations:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
