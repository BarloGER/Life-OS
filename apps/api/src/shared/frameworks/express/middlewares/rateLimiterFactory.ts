import rateLimit from 'express-rate-limit';

export function createRateLimiter(
  windowMsInMinutes: number,
  maxRequests: number,
) {
  if (process.env.NODE_ENV === 'development') {
    return rateLimit({
      windowMs: 1 * 60 * 1000, // e.g. 15 minutes
      max: 100, // e.g. 100 requests / ip
      message: { errorCode: 'errors.tooManyRequests' },
      standardHeaders: true,
      legacyHeaders: false,
    });
  }

  return rateLimit({
    windowMs: windowMsInMinutes * 60 * 1000, // e.g. 15 minutes
    max: maxRequests, // e.g. 100 requests / ip
    message: { errorCode: 'errors.tooManyRequests' },
    standardHeaders: true,
    legacyHeaders: false,
  });
}
