import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      name: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
    },
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
    apiHost: process.env.API_HOST,
    filesHost: process.env.FILES_HOST,
    landingUrl: process.env.LANDING_URL,
    files_path: process.env.FILES_PATH,
  };
});
