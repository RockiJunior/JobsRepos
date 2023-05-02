import { Response } from 'express';
import Exception from './Exception';
import { logsError } from './registroError';

export default function errorHandler(
  error: unknown,
  res: Response,
  logout: boolean = false
) {
  logsError(error);
  console.log(error);

  if (error instanceof Exception) {
    return res.status(400).json({ message: error.message, logout });
  }

  if (error instanceof Error) {
    return res.status(500).json({ message: error.message, logout });
  }

  return res.status(500).json(error);
}
