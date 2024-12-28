import https from 'https';
import fs from 'fs';
import path from 'path';
import express, { Express, Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import { sessionConfig } from '../express-session';
import { AppDependencies } from 'main';
import { createAuthenticationRouter } from './routes/authenticationRouter';

export function initializeServer(dependencies: AppDependencies) {
  const app: Express = express();
  const PORT = 8080;
  const HOST = '0.0.0.0';

  const whitelist = process.env.CLIENT_URLS
    ? process.env.CLIENT_URLS.split(',')
    : [];

  const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.set('trust proxy', 1);
  app.use(sessionConfig);

  app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Welcome to LifeOS api</h1>');
  });

  const authenticationRouter = createAuthenticationRouter(dependencies);
  app.use('/auth', authenticationRouter);

  app.use('*', (req: Request, res: Response) => {
    res.send('<h1>404! Page not found!</h1>');
  });

  if (process.env.NODE_ENV === 'development') {
    const keyPath = path.join(__dirname, 'server.key');
    const certPath = path.join(__dirname, 'server.cert');

    const sslOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };

    https.createServer(sslOptions, app).listen(PORT, HOST, () => {
      console.log(
        `[server]: HTTPS Server is running on https://${HOST}:${PORT}`
      );
    });
  } else {
    app.listen(PORT, () => {
      console.log(`[server]: Server is running on port: ${PORT}`);
    });
  }
}
