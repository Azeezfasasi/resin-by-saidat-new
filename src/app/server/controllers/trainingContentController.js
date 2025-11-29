import TrainingContent from '@/app/server/models/TrainingContent';

/**
 * Get all training content
 */
export async function getAllTrainingContent() {
  try {
    const content = await TrainingContent.find({ deletedAt: null }).sort({
      createdAt: -1
    });

    return {
      success: true,
      data: content,
      count: content.length
    };
  } catch (error) {
    console.error('Error fetching training content:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get active published training content
 */
export async function getActiveTrainingContent() {
  try {
    const content = await TrainingContent.findOne({
      isActive: true,
      isPublished: true,
      deletedAt: null
    });

    if (!content) {
      return {
        success: false,
        error: 'No active training content found',
        statusCode: 404
      };
    }

    return {
      success: true,
      data: content
    };
  } catch (error) {
    console.error('Error fetching active training content:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get training content by ID
 */
export async function getTrainingContentById(id) {
  try {
    const content = await TrainingContent.findById(id);

    if (!content || content.deletedAt) {
      return {
        success: false,
        error: 'Training content not found',
        statusCode: 404
      };
    }

    return {
      success: true,
      data: content
    };
  } catch (error) {
    console.error('Error fetching training content:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create training content
 */
export async function createTrainingContent(data, userId) {
  try {
    const {
      title,
      description,
      duration,
      classSize,
      nextSession,
      pricing,
      curriculum,
      prerequisites,
      outcomes,
      instructor,
      materials,
      isPublished
    } = data;

    // Validate required fields
    if (!duration || !classSize || !nextSession || !pricing) {
      return {
        success: false,
        error: 'Missing required fields: duration, classSize, nextSession, pricing',
        statusCode: 400
      };
    }

    // Validate pricing
    if (pricing.standardPrice < 0 || pricing.earlyBirdPrice < 0) {
      return {
        success: false,
        error: 'Prices cannot be negative',
        statusCode: 400
      };
    }

    // Validate dates
    const startDate = new Date(nextSession.startDate);
    const endDate = new Date(nextSession.endDate);

    if (endDate <= startDate) {
      return {
        success: false,
        error: 'End date must be after start date',
        statusCode: 400
      };
    }

    const content = await TrainingContent.create({
      title,
      description,
      duration,
      classSize,
      nextSession,
      pricing,
      curriculum,
      prerequisites,
      outcomes,
      instructor,
      materials,
      isPublished: isPublished || false,
      createdBy: userId,
      updatedBy: userId
    });

    return {
      success: true,
      data: content,
      statusCode: 201
    };
  } catch (error) {
    console.error('Error creating training content:', error);
    return {
      success: false,
      error: error.message,
      statusCode: 500
    };
  }
}

/**
 * Update training content
 */
export async function updateTrainingContent(id, data, userId) {
  try {
    const content = await TrainingContent.findById(id);

    if (!content || content.deletedAt) {
      return {
        success: false,
        error: 'Training content not found',
        statusCode: 404
      };
    }

    // Validate pricing if being updated
    if (data.pricing) {
      if (data.pricing.standardPrice < 0 || data.pricing.earlyBirdPrice < 0) {
        return {
          success: false,
          error: 'Prices cannot be negative',
          statusCode: 400
        };
      }
    }

    // Validate dates if being updated
    if (data.nextSession) {
      const startDate = new Date(data.nextSession.startDate);
      const endDate = new Date(data.nextSession.endDate);

      if (endDate <= startDate) {
        return {
          success: false,
          error: 'End date must be after start date',
          statusCode: 400
        };
      }
    }

    // Update allowed fields
    const allowedFields = [
      'title',
      'description',
      'duration',
      'classSize',
      'nextSession',
      'pricing',
      'curriculum',
      'prerequisites',
      'outcomes',
      'instructor',
      'materials',
      'isActive',
      'isPublished'
    ];

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        content[field] = data[field];
      }
    });

    content.updatedBy = userId;
    await content.save();

    return {
      success: true,
      data: content
    };
  } catch (error) {
    console.error('Error updating training content:', error);
    return {
      success: false,
      error: error.message,
      statusCode: 500
    };
  }
}

/**
 * Update class size (increment when registration is made)
 */
export async function updateClassSize(id, increment = 1) {
  try {
    const content = await TrainingContent.findByIdAndUpdate(
      id,
      { $inc: { 'classSize.current': increment } },
      { new: true }
    );

    if (!content) {
      return {
        success: false,
        error: 'Training content not found',
        statusCode: 404
      };
    }

    return {
      success: true,
      data: content
    };
  } catch (error) {
    console.error('Error updating class size:', error);
    return {
      success: false,
      error: error.message,
      statusCode: 500
    };
  }
}

/**
 * Delete training content (soft delete)
 */
export async function deleteTrainingContent(id) {
  try {
    const content = await TrainingContent.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!content) {
      return {
        success: false,
        error: 'Training content not found',
        statusCode: 404
      };
    }

    return {
      success: true,
      message: 'Training content deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting training content:', error);
    return {
      success: false,
      error: error.message,
      statusCode: 500
    };
  }
}

/**
 * Publish/Unpublish training content
 */
export async function publishTrainingContent(id, publish) {
  try {
    const content = await TrainingContent.findByIdAndUpdate(
      id,
      { isPublished: publish },
      { new: true }
    );

    if (!content) {
      return {
        success: false,
        error: 'Training content not found',
        statusCode: 404
      };
    }

    return {
      success: true,
      data: content,
      message: publish ? 'Training content published' : 'Training content unpublished'
    };
  } catch (error) {
    console.error('Error publishing training content:', error);
    return {
      success: false,
      error: error.message,
      statusCode: 500
    };
  }
}
