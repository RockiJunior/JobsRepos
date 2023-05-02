import { mkdirSync } from 'fs';
import qr from 'qrcode';

export const generateQR = async (
  destination: string,
  filename: string,
  url: string
) => {
  mkdirSync('.' + destination, { recursive: true });
  await qr.toFile('.' + destination + '/' + filename, url);

  return;
};
