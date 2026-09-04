import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

export const sendOnboardingEmail = async (email, name, temporaryPassword) => {
  if (!resend) {
    console.warn('Onboarding email not sent: RESEND_API_KEY is missing.');
    return { success: false, error: 'API Key missing' };
  }
  try {
    const { data, error } = await resend.emails.send({
      from: 'RCS Onboarding <onboarding@resend.dev>', // Using resend.dev for testing/default
      to: [email],
      subject: 'Welcome to Royal Consultancy Services - Your Account is Ready',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #1a237e; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Welcome to RCS</h1>
          </div>
          <div style="padding: 30px;">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Welcome to <strong>Royal Consultancy Services</strong>! Your employee account has been successfully created. You can now access the Employee Management Dashboard.</p>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p style="margin-top: 0;"><strong>Your Login Credentials:</strong></p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Temporary Password:</strong> <code style="background-color: #e0e0e0; padding: 2px 5px; border-radius: 3px;">${temporaryPassword}</code></p>
            </div>

            <p style="color: #d32f2f; font-weight: bold;">Important: For security reasons, you will be required to change this password upon your first login.</p>

            <div style="text-align: center; margin-top: 30px;">
              <a href="#" style="background-color: #1a237e; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Dashboard</a>
            </div>
          </div>
          <div style="background-color: #f5f5f5; color: #777; padding: 15px; text-align: center; font-size: 12px;">
            <p>&copy; 2026 Royal Consultancy Services. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error sending email:', err);
    return { success: false, error: err };
  }
};
