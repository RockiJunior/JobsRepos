import http from 'http';
import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import { swaggerDocument } from './swagger/swaggerOptions';
import Router from './routes/index.routes';
import morgan from 'morgan';
import { logMiddleware } from './middleware/log';

const app = express();

app.use(cors());
app.use(logMiddleware);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/api', Router);
app.use('/public', express.static('public'));
app.use('/assets', express.static('assets'));

const server = http.createServer(app);

export default server;
