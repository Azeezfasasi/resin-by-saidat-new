/**
 * Training Registration Email Service
 * Handles sending emails to candidates and admins for training registrations
 */

import {
  trainingRegistrationConfirmationTemplate,
  adminTrainingRegistrationNotificationTemplate,
  trainingStatusUpdateTemplate,
  adminTrainingStatusUpdateTemplate,
  trainingConfirmationEmailTemplate,
} from './trainingEmailTemplates.js';
import { sendEmailViaBrevo } from './brevoEmailService.js';

// Parse comma-separated admin emails
const parseAdminEmails = () => {
  const adminEmailsEnv = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.BREVO_SENDER_EMAIL;
  if (!adminEmailsEnv) return [];
  return adminEmailsEnv.split(',').map(e => e.trim()).filter(e => e.length > 0);
};

const ADMIN_EMAILS = parseAdminEmails();

/**
 * Send registration confirmation email to candidate
 */
export const sendTrainingRegistrationConfirmationEmail = async (registration) => {
  try {
    if (!registration.email) {
      console.error('❌ Candidate email not found');
      return { success: false, error: 'No candidate email' };
    }

    const htmlContent = trainingRegistrationConfirmationTemplate(registration);

    const result = await sendEmailViaBrevo({
      to: registration.email,
      subject: `Registration Received - Resin By Saidat Training Program`,
      htmlContent,
      tags: ['training-registration', 'candidate-confirmation'],
    });

    if (result.success) {
      console.log(`✓ Training registration confirmation sent to ${registration.email}`);
    } else {
      console.error(`✗ Failed to send training registration confirmation: ${result.error}`);
    }

    return result;
  } catch (error) {
    console.error('❌ Error sending training registration confirmation:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send registration notification email to admin(s)
 */
export const sendAdminTrainingRegistrationNotification = async (registration) => {
  try {
    const htmlContent = adminTrainingRegistrationNotificationTemplate(registration);
    const results = [];
    let successCount = 0;

    for (const adminEmail of ADMIN_EMAILS) {
      const result = await sendEmailViaBrevo({
        to: adminEmail,
        subject: `New Training Registration - ${registration.firstName} ${registration.lastName}`,
        htmlContent,
        tags: ['training-registration', 'admin-alert'],
      });

      if (result.success) {
        console.log(`✓ Admin notification email sent to ${adminEmail}`);
        successCount++;
      } else {
        console.error(`✗ Failed to send admin notification to ${adminEmail}: ${result.error}`);
      }

      results.push({ email: adminEmail, success: result.success, error: result.error });
      await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
    }

    return {
      success: successCount > 0,
      totalAttempted: ADMIN_EMAILS.length,
      successCount,
      results,
    };
  } catch (error) {
    console.error('❌ Error sending admin training registration notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send status update email to candidate
 */
export const sendTrainingStatusUpdateEmail = async (registration, changeDetails) => {
  try {
    if (!registration.email) {
      console.error('❌ Candidate email not found');
      return { success: false, error: 'No candidate email' };
    }

    const htmlContent = trainingStatusUpdateTemplate(registration, changeDetails);

    const result = await sendEmailViaBrevo({
      to: registration.email,
      subject: `Your Training Registration Status Has Been Updated`,
      htmlContent,
      tags: ['training-update', 'candidate-notification'],
    });

    if (result.success) {
      console.log(`✓ Training status update email sent to ${registration.email}`);
    } else {
      console.error(`✗ Failed to send training status update: ${result.error}`);
    }

    return result;
  } catch (error) {
    console.error('❌ Error sending training status update:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send status update notification to admin(s)
 */
export const sendAdminTrainingStatusUpdateNotification = async (registration, changeDetails) => {
  try {
    const htmlContent = adminTrainingStatusUpdateTemplate(registration, changeDetails);
    const results = [];
    let successCount = 0;

    for (const adminEmail of ADMIN_EMAILS) {
      const result = await sendEmailViaBrevo({
        to: adminEmail,
        subject: `Training Registration Modified - ${registration.firstName} ${registration.lastName}`,
        htmlContent,
        tags: ['training-update', 'admin-notification'],
      });

      if (result.success) {
        console.log(`✓ Admin status update notification sent to ${adminEmail}`);
        successCount++;
      } else {
        console.error(`✗ Failed to send admin notification to ${adminEmail}: ${result.error}`);
      }

      results.push({ email: adminEmail, success: result.success, error: result.error });
      await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
    }

    return {
      success: successCount > 0,
      totalAttempted: ADMIN_EMAILS.length,
      successCount,
      results,
    };
  } catch (error) {
    console.error('❌ Error sending admin training status update:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send confirmation email when registration is marked as confirmed
 */
export const sendTrainingConfirmationEmail = async (registration) => {
  try {
    if (!registration.email) {
      console.error('❌ Candidate email not found');
      return { success: false, error: 'No candidate email' };
    }

    const htmlContent = trainingConfirmationEmailTemplate(registration);

    const result = await sendEmailViaBrevo({
      to: registration.email,
      subject: `🎉 Your Training Registration is Confirmed! - Resin By Saidat`,
      htmlContent,
      tags: ['training-confirmed', 'candidate-confirmation'],
    });

    if (result.success) {
      console.log(`✓ Training confirmation email sent to ${registration.email}`);
    } else {
      console.error(`✗ Failed to send training confirmation: ${result.error}`);
    }

    return result;
  } catch (error) {
    console.error('❌ Error sending training confirmation email:', error);
    return { success: false, error: error.message };
  }
};
