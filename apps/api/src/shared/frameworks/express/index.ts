import express, { Express, Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';

export const initializeServer = (dependencies) => {
  const app: Express = express();
  const PORT = process.env.PORT || 8080;
  const corsOptions: CorsOptions = {
    origin: '*',
  };

  app.use(cors(corsOptions));
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Welcome to LifeOS api</h1>');
  });

  app.use('*', (req: Request, res: Response) => {
    res.send('<h1>404! Page not found!</h1>');
  });

  app.listen(PORT, () => {
    console.log(`[server]: Server is running on port: ${PORT}`);
  });
};
