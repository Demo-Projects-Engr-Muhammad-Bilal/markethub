export const ENV = {
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',

  APP_NAME: process.env.APP_NAME || 'MarketHub',

  RESEND_API_KEY: process.env.RESEND_API_KEY as string,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL as string,

  RESET_TOKEN_EXPIRY_HOURS: parseInt(process.env.RESET_TOKEN_EXPIRY_HOURS || '1'),

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI as string,

  ROLES_WITH_2FA: (process.env.ROLES_WITH_2FA || 'owner,admin,seller,dropshipper').split(','),

  FRONTEND_URL: process.env.FRONTEND_URL as string,
  ADMIN_URL: process.env.ADMIN_URL as string,
};
