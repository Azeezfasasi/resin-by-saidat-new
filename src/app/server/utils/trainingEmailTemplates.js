/**
 * Training Registration Email Templates
 */

export const trainingRegistrationConfirmationTemplate = (registration) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .header { background-color: #b8860b; color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
        .details { background-color: #f5f5f5; padding: 20px; border-left: 4px solid #b8860b; margin: 20px 0; border-radius: 3px; }
        .detail-row { margin: 10px 0; display: flex; }
        .detail-label { font-weight: bold; width: 150px; color: #b8860b; }
        .detail-value { flex: 1; }
        .button { display: inline-block; background-color: #b8860b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: bold; }
        .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; margin-top: 20px; }
        .success-badge { background-color: #4caf50; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Registration Received!</h1>
          <p>Thank you for your interest in our training program</p>
        </div>
        
        <div class="content">
          <h2>Dear ${registration.firstName} ${registration.lastName},</h2>
          
          <p>We're excited to have received your registration for our training program. Your application has been successfully submitted and is now under review.</p>
          
          <div class="details">
            <h3 style="color: #b8860b; margin-top: 0;">Registration Details:</h3>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${registration.firstName} ${registration.lastName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${registration.email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">${registration.phone}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">City:</span>
              <span class="detail-value">${registration.city}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Experience Level:</span>
              <span class="detail-value">${registration.experience.charAt(0).toUpperCase() + registration.experience.slice(1)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Preferred Session:</span>
              <span class="detail-value">${registration.sessionDate.charAt(0).toUpperCase() + registration.sessionDate.slice(1)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value"><span class="success-badge">${registration.status.toUpperCase()}</span></span>
            </div>
          </div>
          
          <h3 style="color: #b8860b;">Next Steps:</h3>
          <ul>
            <li>We will review your application and contact you within 24 hours</li>
            <li>Once confirmed, you'll receive payment details and training materials</li>
            <li>Training fee: ₦${registration.paymentAmount?.toLocaleString() || 'TBD'}</li>
            <li>Keep this email for your records</li>
          </ul>
          
          <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
          
          <p>Best regards,<br><strong>Resin By Saidat Training Team</strong></p>
        </div>
        
        <div class="footer">
          <p>&copy; 2025 Resin By Saidat. All rights reserved.</p>
          <p>This is an automated email. Please do not reply directly.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const adminTrainingRegistrationNotificationTemplate = (registration) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Training Registration</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .header { background-color: #d4a574; color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
        .details { background-color: #f5f5f5; padding: 20px; border-left: 4px solid #d4a574; margin: 20px 0; border-radius: 3px; }
        .detail-row { margin: 10px 0; display: flex; }
        .detail-label { font-weight: bold; width: 150px; color: #d4a574; }
        .detail-value { flex: 1; }
        .badge { display: inline-block; padding: 5px 10px; border-radius: 3px; font-weight: bold; color: white; }
        .status-pending { background-color: #ff9800; }
        .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Training Registration</h1>
          <p>A new candidate has registered for the training program</p>
        </div>
        
        <div class="content">
          <h2>Registration Alert</h2>
          
          <p><strong>A new candidate has submitted their training registration. Below are their details:</strong></p>
          
          <div class="details">
            <h3 style="color: #d4a574; margin-top: 0;">Candidate Information:</h3>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${registration.firstName} ${registration.lastName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${registration.email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">${registration.phone}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">City:</span>
              <span class="detail-value">${registration.city}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Occupation:</span>
              <span class="detail-value">${registration.occupation || 'Not provided'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Experience Level:</span>
              <span class="detail-value">${registration.experience.charAt(0).toUpperCase() + registration.experience.slice(1)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Preferred Session:</span>
              <span class="detail-value">${registration.sessionDate.charAt(0).toUpperCase() + registration.sessionDate.slice(1)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Referral Source:</span>
              <span class="detail-value">${registration.referralSource || 'Not provided'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Registration Date:</span>
              <span class="detail-value">${new Date(registration.registrationDate).toLocaleDateString()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value"><span class="badge status-pending">${registration.status.toUpperCase()}</span></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment Status:</span>
              <span class="detail-value"><span class="badge" style="background-color: #f44336;">${registration.paymentStatus.toUpperCase()}</span></span>
            </div>
          </div>
          
          <h3 style="color: #d4a574;">Action Required:</h3>
          <ul>
            <li>Review the candidate's information</li>
            <li>Confirm or reject the registration</li>
            <li>Send confirmation email once approved</li>
            <li>Update payment status when payment is received</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>&copy; 2025 Resin By Saidat. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const trainingStatusUpdateTemplate = (registration, changeDetails) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Status Update</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .header { background-color: #b8860b; color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
        .update-box { background-color: #e8f5e9; padding: 20px; border-left: 4px solid #4caf50; margin: 20px 0; border-radius: 3px; }
        .detail-row { margin: 10px 0; }
        .badge { display: inline-block; padding: 5px 10px; border-radius: 3px; font-weight: bold; color: white; }
        .status-confirmed { background-color: #4caf50; }
        .status-paid { background-color: #2196f3; }
        .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Registration has been Updated</h1>
          <p>Important information about your training registration</p>
        </div>
        
        <div class="content">
          <h2>Hello ${registration.firstName},</h2>
          
          <p>We have an update regarding your training registration. Please review the changes below:</p>
          
          <div class="update-box">
            <h3 style="color: #4caf50; margin-top: 0;">Updates:</h3>
            ${changeDetails.statusChanged ? `
              <div class="detail-row">
                <strong>Registration Status:</strong> <span class="badge status-confirmed">${registration.status.toUpperCase()}</span>
              </div>
              <p style="font-size: 14px; color: #666;">Your registration status has been updated to ${registration.status}.</p>
            ` : ''}
            ${changeDetails.paymentStatusChanged ? `
              <div class="detail-row">
                <strong>Payment Status:</strong> <span class="badge status-paid">${registration.paymentStatus.toUpperCase()}</span>
              </div>
              <p style="font-size: 14px; color: #666;">Your payment status has been updated to ${registration.paymentStatus}.</p>
            ` : ''}
            ${changeDetails.detailsChanged ? `
              <div class="detail-row">
                <strong>Registration Details:</strong> Your information has been updated in our system.
              </div>
            ` : ''}
          </div>
          
          <h3 style="color: #b8860b;">Current Status Summary:</h3>
          <ul>
            <li><strong>Name:</strong> ${registration.firstName} ${registration.lastName}</li>
            <li><strong>Registration Status:</strong> <span class="badge status-confirmed">${registration.status.toUpperCase()}</span></li>
            <li><strong>Payment Status:</strong> <span class="badge status-paid">${registration.paymentStatus.toUpperCase()}</span></li>
            <li><strong>Training Fee:</strong> ₦${registration.paymentAmount?.toLocaleString() || 'TBD'}</li>
          </ul>
          
          <p>If you have any questions about these updates, please contact our support team immediately.</p>
          
          <p>Best regards,<br><strong>Resin By Saidat Training Team</strong></p>
        </div>
        
        <div class="footer">
          <p>&copy; 2025 Resin By Saidat. All rights reserved.</p>
          <p>This is an automated email. Please do not reply directly.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const adminTrainingStatusUpdateTemplate = (registration, changeDetails) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Training Registration Updated</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .header { background-color: #d4a574; color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
        .changes-box { background-color: #fff3e0; padding: 20px; border-left: 4px solid #ff9800; margin: 20px 0; border-radius: 3px; }
        .detail-row { margin: 10px 0; }
        .badge { display: inline-block; padding: 5px 10px; border-radius: 3px; font-weight: bold; color: white; }
        .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Training Registration Modified</h1>
          <p>A training registration has been updated</p>
        </div>
        
        <div class="content">
          <h2>Registration Update Notification</h2>
          
          <p><strong>A training registration has been modified. Below are the changes:</strong></p>
          
          <div class="changes-box">
            <h3 style="color: #ff9800; margin-top: 0;">Changes Made:</h3>
            ${changeDetails.statusChanged ? `
              <div class="detail-row">
                <strong>Registration Status:</strong> ${changeDetails.previousStatus} → <span class="badge" style="background-color: #4caf50;">${registration.status.toUpperCase()}</span>
              </div>
            ` : ''}
            ${changeDetails.paymentStatusChanged ? `
              <div class="detail-row">
                <strong>Payment Status:</strong> ${changeDetails.previousPaymentStatus} → <span class="badge" style="background-color: #2196f3;">${registration.paymentStatus.toUpperCase()}</span>
              </div>
            ` : ''}
            ${changeDetails.detailsChanged ? `
              <div class="detail-row">
                <strong>Registration Details:</strong> Contact information or preferences have been updated
              </div>
            ` : ''}
          </div>
          
          <h3 style="color: #d4a574;">Candidate Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${registration.firstName} ${registration.lastName}</li>
            <li><strong>Email:</strong> ${registration.email}</li>
            <li><strong>Phone:</strong> ${registration.phone}</li>
            <li><strong>Current Status:</strong> <span class="badge" style="background-color: #4caf50;">${registration.status.toUpperCase()}</span></li>
            <li><strong>Payment Status:</strong> <span class="badge" style="background-color: #2196f3;">${registration.paymentStatus.toUpperCase()}</span></li>
          </ul>
        </div>
        
        <div class="footer">
          <p>&copy; 2025 Resin By Saidat. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const trainingConfirmationEmailTemplate = (registration) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Training Registration is Confirmed!</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .header { background-color: #4caf50; color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
        .confirmed-box { background-color: #e8f5e9; padding: 20px; border-left: 4px solid #4caf50; margin: 20px 0; border-radius: 3px; }
        .detail-row { margin: 10px 0; }
        .badge { display: inline-block; padding: 8px 15px; border-radius: 3px; font-weight: bold; color: white; background-color: #4caf50; }
        .next-steps { background-color: #e3f2fd; padding: 20px; border-left: 4px solid #2196f3; margin: 20px 0; border-radius: 3px; }
        .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Your Registration is Confirmed!</h1>
          <p>You're all set for the training program</p>
        </div>
        
        <div class="content">
          <h2>Hello ${registration.firstName},</h2>
          
          <p>Congratulations! Your training registration has been <strong>officially confirmed</strong>. We're excited to have you join our training program!</p>
          
          <div class="confirmed-box">
            <h3 style="color: #4caf50; margin-top: 0;">Confirmation Details:</h3>
            <div class="detail-row">
              <strong>Status:</strong> <span class="badge">CONFIRMED</span>
            </div>
            <div class="detail-row">
              <strong>Session:</strong> ${registration.sessionDate.charAt(0).toUpperCase() + registration.sessionDate.slice(1)}
            </div>
            <div class="detail-row">
              <strong>Training Fee:</strong> ₦${registration.paymentAmount?.toLocaleString() || 'TBD'}
            </div>
          </div>
          
          <div class="next-steps">
            <h3 style="color: #2196f3; margin-top: 0;">Next Steps:</h3>
            <ol>
              <li><strong>Payment:</strong> Transfer the training fee of ₦${registration.paymentAmount?.toLocaleString() || 'TBD'} to confirm your spot</li>
              <li><strong>Training Materials:</strong> You'll receive training materials via email 48 hours before the session</li>
              <li><strong>Session Reminders:</strong> Expect reminder emails 24 hours and 1 hour before the training begins</li>
              <li><strong>Confirmation Link:</strong> You'll receive a confirmation link to join the training session</li>
            </ol>
          </div>
          
          <h3 style="color: #4caf50;">Your Registration Summary:</h3>
          <ul>
            <li><strong>Name:</strong> ${registration.firstName} ${registration.lastName}</li>
            <li><strong>Email:</strong> ${registration.email}</li>
            <li><strong>Phone:</strong> ${registration.phone}</li>
            <li><strong>City:</strong> ${registration.city}</li>
            <li><strong>Experience Level:</strong> ${registration.experience.charAt(0).toUpperCase() + registration.experience.slice(1)}</li>
          </ul>
          
          <p style="background-color: #fff3e0; padding: 15px; border-left: 4px solid #ff9800; border-radius: 3px; margin: 20px 0;">
            <strong>⚠️ Important:</strong> Please confirm receipt of this email by replying "CONFIRMED". This ensures we have the correct contact information.
          </p>
          
          <p>If you have any questions or need to make changes to your registration, please contact us immediately at <strong>info@resinbysaidat.com</strong></p>
          
          <p>Best regards,<br><strong>Resin By Saidat Training Team</strong></p>
        </div>
        
        <div class="footer">
          <p>&copy; 2025 Resin By Saidat. All rights reserved.</p>
          <p>This is an automated email. Please do not reply directly to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
