import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors";
import { z } from "zod";
import { JsonWebTokenError } from "jsonwebtoken";

const handleErrors = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  if (error instanceof AppError) {
    return res.status(error.status).json({ message: error.message });
  }

  if (error instanceof z.ZodError) {
    return res.status(400).json(error.flatten().fieldErrors);
  }

  if (error instanceof JsonWebTokenError) {
    return res.status(401).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: "Internal server error." });
};

export { handleErrors };
