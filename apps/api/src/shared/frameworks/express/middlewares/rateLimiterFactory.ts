import rateLimit from 'express-rate-limit';

export function createRateLimiter(
  windowMsInMinutes: number,
  maxRequests: number,
) {
  return rateLimit({
    windowMs: windowMsInMinutes * 60 * 1000, // e.g. 15 minutes
    max: maxRequests, // e.g. 100 requests / ip
    message: { errorCode: 'errors.tooManyRequests' },
    standardHeaders: true,
    legacyHeaders: false,
  });
}
