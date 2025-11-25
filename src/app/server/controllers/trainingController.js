import TrainingRegistration from '@/app/server/models/TrainingRegistration';

// Get all training registrations
export async function getAllRegistrations(req) {
  try {
    const { page = 1, limit = 20, status, sessionDate, search } = req.query || {};

    const skip = (page - 1) * limit;
    const query = { deletedAt: null };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by session date
    if (sessionDate) {
      query.sessionDate = sessionDate;
    }

    // Search by name, email, or phone
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const registrations = await TrainingRegistration.find(query)
      .sort({ registrationDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await TrainingRegistration.countDocuments(query);

    return {
      success: true,
      data: registrations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Get single registration
export async function getRegistrationById(id) {
  try {
    const registration = await TrainingRegistration.findById(id);

    if (!registration) {
      return {
        success: false,
        error: 'Registration not found',
        statusCode: 404,
      };
    }

    return {
      success: true,
      data: registration,
    };
  } catch (error) {
    console.error('Error fetching registration:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Create registration
export async function createRegistration(data) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      experience,
      city,
      occupation,
      sessionDate,
      referralSource,
      agreeTerms,
    } = data;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !city || !agreeTerms) {
      return {
        success: false,
        error: 'Missing required fields',
        statusCode: 400,
      };
    }

    // Check if email already registered
    const existingRegistration = await TrainingRegistration.findOne({
      email,
      deletedAt: null,
    });

    if (existingRegistration) {
      return {
        success: false,
        error: 'This email is already registered',
        statusCode: 409,
      };
    }

    // Create registration
    const registration = await TrainingRegistration.create({
      firstName,
      lastName,
      email,
      phone,
      experience,
      city,
      occupation,
      sessionDate,
      referralSource,
      agreeTerms,
      status: 'pending',
    });

    // TODO: Send confirmation email via Brevo
    // TODO: Add to Brevo contacts

    return {
      success: true,
      data: registration,
      statusCode: 201,
    };
  } catch (error) {
    console.error('Error creating registration:', error);
    return {
      success: false,
      error: error.message,
      statusCode: 500,
    };
  }
}

// Update registration status
export async function updateRegistrationStatus(id, status) {
  try {
    const validStatuses = [
      'pending',
      'confirmed',
      'paid',
      'completed',
      'cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return {
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        statusCode: 400,
      };
    }

    const registration = await TrainingRegistration.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!registration) {
      return {
        success: false,
        error: 'Registration not found',
        statusCode: 404,
      };
    }

    return {
      success: true,
      data: registration,
    };
  } catch (error) {
    console.error('Error updating registration status:', error);
    return {
      success: false,
      error: error.message,
      statusCode: 500,
    };
  }
}

// Update payment status
export async function updatePaymentStatus(id, paymentStatus, paymentAmount) {
  try {
    const validPaymentStatuses = ['unpaid', 'partial', 'paid'];

    if (!validPaymentStatuses.includes(paymentStatus)) {
      return {
        success: false,
        error: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(', ')}`,
        statusCode: 400,
      };
    }

    const updateData = { paymentStatus };
    if (paymentAmount) {
      updateData.paymentAmount = paymentAmount;
    }

    // Auto-confirm if payment is complete
    if (paymentStatus === 'paid') {
      updateData.status = 'paid';
    }

    const registration = await TrainingRegistration.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!registration) {
      return {
        success: false,
        error: 'Registration not found',
        statusCode: 404,
      };
    }

    return {
      success: true,
      data: registration,
    };
  } catch (error) {
    console.error('Error updating payment status:', error);
    return {
      success: false,
      error: error.message,
      statusCode: 500,
    };
  }
}

// Update registration details
export async function updateRegistration(id, updateData) {
  try {
    // Only allow updating specific fields
    const allowedFields = [
      'firstName',
      'lastName',
      'phone',
      'city',
      'occupation',
      'sessionDate',
      'notes',
    ];

    const filteredData = {};
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    const registration = await TrainingRegistration.findByIdAndUpdate(
      id,
      filteredData,
      { new: true, runValidators: true }
    );

    if (!registration) {
      return {
        success: false,
        error: 'Registration not found',
        statusCode: 404,
      };
    }

    return {
      success: true,
      data: registration,
    };
  } catch (error) {
    console.error('Error updating registration:', error);
    return {
      success: false,
      error: error.message,
      statusCode: 500,
    };
  }
}

// Soft delete registration
export async function deleteRegistration(id) {
  try {
    const registration = await TrainingRegistration.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!registration) {
      return {
        success: false,
        error: 'Registration not found',
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: 'Registration deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting registration:', error);
    return {
      success: false,
      error: error.message,
      statusCode: 500,
    };
  }
}

// Get registration statistics
export async function getRegistrationStats() {
  try {
    const stats = await Promise.all([
      // Total registrations
      TrainingRegistration.countDocuments({ deletedAt: null }),
      // By status
      TrainingRegistration.aggregate([
        { $match: { deletedAt: null } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      // By session date
      TrainingRegistration.aggregate([
        { $match: { deletedAt: null } },
        { $group: { _id: '$sessionDate', count: { $sum: 1 } } },
      ]),
      // By payment status
      TrainingRegistration.aggregate([
        { $match: { deletedAt: null } },
        { $group: { _id: '$paymentStatus', count: { $sum: 1 } } },
      ]),
      // Revenue calculation
      TrainingRegistration.aggregate([
        {
          $match: { deletedAt: null, paymentStatus: 'paid' },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$paymentAmount' },
            paidRegistrations: { $sum: 1 },
          },
        },
      ]),
    ]);

    const [
      totalRegistrations,
      byStatus,
      bySession,
      byPaymentStatus,
      revenue,
    ] = stats;

    return {
      success: true,
      data: {
        totalRegistrations,
        byStatus: byStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        bySessionDate: bySession.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byPaymentStatus: byPaymentStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        revenue: revenue[0] || { totalRevenue: 0, paidRegistrations: 0 },
      },
    };
  } catch (error) {
    console.error('Error fetching registration stats:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Export registrations to CSV (returns formatted data)
export async function exportRegistrations(filters = {}) {
  try {
    const query = { deletedAt: null };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.sessionDate) {
      query.sessionDate = filters.sessionDate;
    }

    const registrations = await TrainingRegistration.find(query).sort({
      registrationDate: -1,
    });

    // Format for CSV
    const csvData = registrations.map(reg => ({
      'First Name': reg.firstName,
      'Last Name': reg.lastName,
      Email: reg.email,
      Phone: reg.phone,
      City: reg.city,
      Occupation: reg.occupation,
      Experience: reg.experience,
      'Session Date': reg.sessionDate,
      'Referral Source': reg.referralSource,
      Status: reg.status,
      'Payment Status': reg.paymentStatus,
      'Payment Amount': reg.paymentAmount,
      'Registration Date': reg.registrationDate.toISOString(),
    }));

    return {
      success: true,
      data: csvData,
      count: csvData.length,
    };
  } catch (error) {
    console.error('Error exporting registrations:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Send confirmation email (placeholder for Brevo integration)
export async function sendConfirmationEmail(registrationId) {
  try {
    const registration = await TrainingRegistration.findById(registrationId);

    if (!registration) {
      return {
        success: false,
        error: 'Registration not found',
        statusCode: 404,
      };
    }

    // TODO: Integrate with Brevo API to send email
    // For now, just update confirmationSentAt
    registration.confirmationSentAt = new Date();
    await registration.save();

    return {
      success: true,
      message: 'Confirmation email sent',
    };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return {
      success: false,
      error: error.message,
      statusCode: 500,
    };
  }
}

// Mark as confirmed
export async function confirmRegistration(id) {
  try {
    const registration = await TrainingRegistration.findByIdAndUpdate(
      id,
      {
        status: 'confirmed',
        confirmationSentAt: new Date(),
      },
      { new: true }
    );

    if (!registration) {
      return {
        success: false,
        error: 'Registration not found',
        statusCode: 404,
      };
    }

    return {
      success: true,
      data: registration,
    };
  } catch (error) {
    console.error('Error confirming registration:', error);
    return {
      success: false,
      error: error.message,
      statusCode: 500,
    };
  }
}
