import express, { Express, Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import { sessionConfig } from '../express-session';
import { AppDependencies } from 'main';
import { createAuthenticationRouter } from './routes/authenticationRouter';

export function initializeServer(dependencies: AppDependencies) {
  const app: Express = express();
  const PORT = process.env.PORT || 8080;
  const corsOptions: CorsOptions = {
    origin: '*',
  };

  app.use(cors(corsOptions));
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(sessionConfig);

  app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Welcome to LifeOS api</h1>');
  });

  const authenticationRouter = createAuthenticationRouter(dependencies);
  app.use('/auth', authenticationRouter);

  app.use('*', (req: Request, res: Response) => {
    res.send('<h1>404! Page not found!</h1>');
  });

  app.listen(PORT, () => {
    console.log(`[server]: Server is running on port: ${PORT}`);
  });
}
