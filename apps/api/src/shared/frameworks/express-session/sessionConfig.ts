import session from 'express-session';
import { sessionStore } from './sessionStore';

// Rolle -> MaxAge in Millisekunden
export const sessionDurations: Record<string, number> = {
  admin: 1 * 60 * 60 * 1000, // 1 Hour
  support: 12 * 60 * 60 * 1000, // 12 Hours
  user: 30 * 24 * 60 * 60 * 1000, // 30 Days
  premiumUser: 30 * 24 * 60 * 60 * 1000, // 30 Days
  guest: 1 * 60 * 60 * 1000, // Optional for guests
};

const sessionSecretsEnv = process.env.SESSION_SECRETS;
if (!sessionSecretsEnv) {
  throw new Error('SESSION_SECRETS environment variable is not set');
}

const sessionSecrets = sessionSecretsEnv.split(', ');
const isProduction = process.env.NODE_ENV === 'production';

export const sessionConfig = session({
  store: sessionStore,
  secret: sessionSecrets,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'lax' : 'strict',
    // maxAge is set dynamically later
  },
});
