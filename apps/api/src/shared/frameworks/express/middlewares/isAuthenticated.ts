import { Request, Response, NextFunction } from 'express';

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      errorCode: 'authentication.errors.notAuthenticated',
    });
  }

  return next();
}
