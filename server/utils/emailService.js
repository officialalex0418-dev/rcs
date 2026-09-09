import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FOOTER_HTML = `
  <div style="background-color: #f8fafc; color: #64748b; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #e2e8f0;">
    <p style="margin: 0 0 10px 0;">&copy; 2026 Royal Consultancy Services (RCS Solutions). All rights reserved.</p>
    <p style="margin: 0;">Narephat-32, Kathmandu, Nepal | +977 9741812381</p>
    <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply.</p>
  </div>
`;

/**
 * Sends a "Thank You" email to job applicants
 */
export const sendThankYouEmail = async (email, name, jobTitle) => {
  if (!resend) return { success: false, error: 'API Key missing' };

  try {
    const { data, error } = await resend.emails.send({
      from: 'RCS Careers <career@rcs.com.np>',
      to: [email],
      subject: `Application Received - ${jobTitle} | RCS Solutions`,
      html: `
        <div style="font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Thank You for Applying!</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
            <p style="font-size: 16px; line-height: 1.6;">We've successfully received your application for the position of <strong>${jobTitle}</strong> at Royal Consultancy Services.</p>
            <p style="font-size: 16px; line-height: 1.6;">Our recruitment team is currently reviewing your profile. We value the time and effort you took to apply, and if your background matches our requirements, we'll reach out to you for the next steps.</p>

            <div style="margin-top: 30px; padding: 20px; background-color: #f1f5f9; border-radius: 12px; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; font-size: 14px; font-weight: 600; color: #475569;">What's next?</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">If shortlisted, you will receive an invitation for an initial screening call or a technical interview.</p>
            </div>

            <p style="margin-top: 30px; font-size: 16px; line-height: 1.6;">Good luck with your application!</p>

            <p style="margin-top: 20px; font-size: 15px; color: #475569;">Best Regards,<br><strong>RCS Careers Team</strong></p>
          </div>
          ${FOOTER_HTML}
        </div>
      `,
    });

    if (error) {
      console.error('RESEND ERROR (Thank You):', JSON.stringify(error, null, 2));
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error sending thank you email:', err);
    return { success: false, error: err };
  }
};

/**
 * Sends a "Congratulations/Onboarding" email to new employees
 */
export const sendOnboardingEmail = async (email, name, temporaryPassword, designation = 'Team Member') => {
  if (!resend) return { success: false, error: 'API Key missing' };

  try {
    const { data, error } = await resend.emails.send({
      from: 'RCS Solutions <hr@rcs.com.np>',
      to: [email],
      subject: 'Congratulations! Welcome to RCS Solutions',
      html: `
        <div style="font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 55%, #7c3aed 100%); color: white; padding: 40px 20px; text-align: center;">
            <div style="background-color: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                <span style="font-size: 30px;">🎉</span>
            </div>
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Congratulations & Welcome!</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
            <p style="font-size: 16px; line-height: 1.6;">We are thrilled to welcome you to <strong>Royal Consultancy Services</strong> as our new <strong>${designation}</strong>. We believe your skills and experience will be a great asset to our team.</p>

            <div style="background-color: #f8fafc; padding: 30px; border-radius: 16px; margin: 30px 0; border: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 15px 0; font-size: 14px; font-weight: 700; color: #64748b; uppercase; tracking-widest;">YOUR PORTAL ACCESS</p>
              <div style="background-color: #ffffff; padding: 15px; border-radius: 12px; margin-bottom: 10px; border: 1px solid #f1f5f9;">
                <p style="margin: 0; font-size: 14px; color: #94a3b8;">Email Address</p>
                <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: 700; color: #1e293b;">${email}</p>
              </div>
              <div style="background-color: #ffffff; padding: 15px; border-radius: 12px; border: 1px solid #f1f5f9;">
                <p style="margin: 0; font-size: 14px; color: #94a3b8;">Temporary Password</p>
                <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: 800; color: #4f46e5; letter-spacing: 2px;">${temporaryPassword}</p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://rcs.com.np/login" style="background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2);">Login to Employee Dashboard</a>
            </div>

            <p style="margin-top: 30px; color: #ef4444; font-weight: 700; font-size: 14px; text-align: center;">Note: For your security, you will be required to change this password upon your first login.</p>

            <p style="margin-top: 40px; font-size: 16px; line-height: 1.6;">We look forward to seeing the great things we'll achieve together!</p>

            <p style="margin-top: 20px; font-size: 15px; color: #475569;">Best Regards,<br><strong>RCS Human Resources</strong></p>
          </div>
          ${FOOTER_HTML}
        </div>
      `,
    });

    if (error) {
      console.error('RESEND ERROR (Onboarding):', JSON.stringify(error, null, 2));
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error sending onboarding email:', err);
    return { success: false, error: err };
  }
};
