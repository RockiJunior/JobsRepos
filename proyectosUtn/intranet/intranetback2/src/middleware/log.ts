import fs, { mkdirSync } from 'fs';
import { Request, Response } from 'express';
import path from 'path';
import dayjs from 'dayjs';
import ip from 'ip';

export const logMiddleware = (req: Request, res: Response, next: any) => {
  const destination = path.resolve(__dirname, '../../logsMiddleware');
  const dir = `${destination}/${dayjs().format('YYYY-MM-DD')}.txt`;

  mkdirSync(destination, { recursive: true });

  fs.appendFileSync(
    dir,
    `[${dayjs().format('HH:mm')}]: Se ingreso en la página ${
      req.url
    } desde la IP ${ip.address()}\n`
  );

  next();
};
