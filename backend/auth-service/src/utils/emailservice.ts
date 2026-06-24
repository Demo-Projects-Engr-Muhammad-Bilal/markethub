import { Resend } from 'resend';
import { ENV } from '../config/env.js'; // Adjust path as needed

const resend = new Resend(ENV.RESEND_API_KEY);

// ------------------------------------------------------------------
// PASSWORD RESET EMAIL
// ------------------------------------------------------------------
export const sendResetEmail = async (toEmail: string, resetToken: string): Promise<void> => {
  const { error } = await resend.emails.send({
    from: ENV.RESEND_FROM_EMAIL || 'MarketHub <onboarding@resend.dev>',
    to: toEmail,
    subject: `Reset Your ${ENV.APP_NAME || 'MarketHub'} Password`,
    html: buildResetEmailHtml(resetToken),
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error('Failed to send reset email.');
  }
};

function buildResetEmailHtml(resetToken: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
          <tr>
            <td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <tr>
                  <td style="background:#09090b;padding:32px 40px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;">
                      Market<span style="color:#e11d48;">Hub</span>
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:40px;">
                    <div style="text-align:center;margin-bottom:32px;">
                      <span style="font-size:28px;">🔑</span>
                      <h2 style="margin:8px 0;color:#09090b;font-size:22px;font-weight:600;">Reset Your Password</h2>
                      <p style="margin:0;color:#71717a;font-size:14px;">We received a request to reset your password.</p>
                    </div>
                    <p style="color:#3f3f46;font-size:14px;line-height:1.6;margin:0 0 24px;text-align:center;">
                      Use the token below to reset your password. It will expire in
                      <strong>${ENV.RESET_TOKEN_EXPIRY_HOURS || 1} hour(s)</strong>.
                    </p>
                    <div style="background:#f4f4f5;border:2px dashed #e11d48;border-radius:12px;padding:20px;text-align:center;margin:24px 0;">
                      <p style="margin:0 0 8px;color:#71717a;font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:1px;">Your Reset Token</p>
                      <p style="margin:0;color:#09090b;font-size:18px;font-weight:700;letter-spacing:2px;word-break:break-all;font-family:monospace;">
                        ${resetToken}
                      </p>
                    </div>
                    <hr style="border:none;border-top:1px solid #f4f4f5;margin:32px 0;" />
                    <p style="color:#a1a1aa;font-size:12px;margin:0;text-align:center;">
                      If you did not request this, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f4f4f5;padding:20px 40px;text-align:center;">
                    <p style="margin:0;color:#a1a1aa;font-size:12px;">© 2025 MarketHub. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

// ------------------------------------------------------------------
// ACCOUNT VERIFICATION EMAIL (New)
// ------------------------------------------------------------------
export const sendVerificationEmail = async (toEmail: string, username: string, role: string, verificationLink: string): Promise<void> => {
  const { error } = await resend.emails.send({
    from: ENV.RESEND_FROM_EMAIL || 'MarketHub <onboarding@resend.dev>',
    to: toEmail,
    subject: 'Verify your MarketHub Account',
    html: buildVerificationEmailHtml(username, role, verificationLink),
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error('Failed to send verification email.');
  }
};

function buildVerificationEmailHtml(username: string, role: string, verificationLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
          <tr>
            <td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <tr>
                  <td style="background:#09090b;padding:32px 40px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;">
                      Market<span style="color:#e11d48;">Hub</span>
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:40px;">
                    <div style="text-align:center;margin-bottom:32px;">
                      <span style="font-size:28px;">👋</span>
                      <h2 style="margin:8px 0;color:#09090b;font-size:22px;font-weight:600;">Welcome, ${username}!</h2>
                      <p style="margin:0;color:#71717a;font-size:14px;">You have registered as a <strong>${role}</strong>.</p>
                    </div>
                    <p style="color:#3f3f46;font-size:14px;line-height:1.6;margin:0 0 24px;text-align:center;">
                      Please verify your email address to activate your MarketHub account.
                    </p>
                    
                    <div style="text-align:center;margin:32px 0;">
                      <a href="${verificationLink}" style="display:inline-block;padding:14px 28px;background-color:#e11d48;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;">
                        Verify My Email
                      </a>
                    </div>

                    <div style="background:#f4f4f5;border-radius:12px;padding:20px;text-align:center;margin:24px 0;">
                      <p style="margin:0 0 8px;color:#71717a;font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:1px;">Or copy and paste this link</p>
                      <p style="margin:0;color:#e11d48;font-size:12px;word-break:break-all;">
                        <a href="${verificationLink}" style="color:#e11d48;text-decoration:underline;">${verificationLink}</a>
                      </p>
                    </div>

                    <hr style="border:none;border-top:1px solid #f4f4f5;margin:32px 0;" />
                    <p style="color:#a1a1aa;font-size:12px;margin:0;text-align:center;">
                      If you did not request this, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f4f4f5;padding:20px 40px;text-align:center;">
                    <p style="margin:0;color:#a1a1aa;font-size:12px;">© 2025 MarketHub. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}