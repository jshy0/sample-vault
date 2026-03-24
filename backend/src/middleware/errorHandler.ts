import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error & { status?: number },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = err.status || 500;
  const message = status < 500 ? err.message : "Internal Server Error";

  if (status >= 500) console.error(err);

  res.status(status).json({ error: message });
};
