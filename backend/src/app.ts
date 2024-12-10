import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { APP_CONSTANTS } from '@config/constants';
import routes from '@routes/index';
import { logger } from '@utils/logger';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: logger.stream }));

// Rutas
app.use(APP_CONSTANTS.APP.PREFIX, routes);

export default app;