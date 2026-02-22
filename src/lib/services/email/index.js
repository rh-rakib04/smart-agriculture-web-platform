/**
 * Email service for sending notifications and emails
 */

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_FROM = process.env.SMTP_FROM;

/**
 * Send email
 * @param {Object} emailData - Email information
 * @param {string} emailData.to - Recipient email
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.html - HTML content
 * @param {string} emailData.text - Plain text content (optional)
 * @returns {Promise<Object>} Send result
 */
export async function sendEmail({ to, subject, html, text }) {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    console.warn('Email service not configured. Email would be sent to:', to);
    // In development, just log the email
    if (process.env.NODE_ENV === 'development') {
      console.log('Email:', { to, subject, html, text });
      return { success: true, messageId: `dev_${Date.now()}` };
    }
    throw new Error('Email service not configured');
  }

  // Placeholder for actual email sending
  // Use nodemailer or similar library in production
  // Example:
  // const transporter = nodemailer.createTransport({...});
  // return await transporter.sendMail({ from: SMTP_FROM, to, subject, html, text });

  return {
    success: true,
    messageId: `msg_${Date.now()}`,
  };
}

/**
 * Send welcome email
 * @param {string} email - Recipient email
 * @param {string} name - User name
 * @returns {Promise<Object>} Send result
 */
export async function sendWelcomeEmail(email, name) {
  return sendEmail({
    to: email,
    subject: 'Welcome to Smart Agriculture Platform',
    html: `
      <h1>Welcome, ${name}!</h1>
      <p>Thank you for joining the Smart Agriculture Platform.</p>
    `,
    text: `Welcome, ${name}! Thank you for joining the Smart Agriculture Platform.`,
  });
}

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} resetToken - Password reset token
 * @returns {Promise<Object>} Send result
 */
export async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
  
  return sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `,
    text: `Password Reset: ${resetUrl}`,
  });
}

