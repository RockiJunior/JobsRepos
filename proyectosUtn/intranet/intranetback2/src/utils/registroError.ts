import dayjs from 'dayjs';
import fs, { mkdirSync } from 'fs';
import path from 'path';

export const logsError = (error: any) => {
  try {
    const destination = path.resolve(__dirname, '../../logs');
    const dir = `${destination}/${dayjs().format('YYYY-MM-DD')}.txt`;

    mkdirSync(destination, { recursive: true });

    fs.appendFileSync(
      dir,
      `[${dayjs().format('HH:mm')}]: ${error.stack}` + `\n`
    );
  } catch (error) {
    console.log(error);
  }
};
