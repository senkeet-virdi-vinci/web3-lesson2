import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import expensesRouter from './routes/expenses.router.ts';
import usersRouter from './routes/user.router.ts';
import categoriesRouter from "./routes/categories.router.ts";
import authRouter from './routes/auth.router.ts';
import { yoga } from './src/graphql/yoga.ts';
import { requireAuth } from './src/middleware/requireAuth.ts';
import helmet from 'helmet';

const app = express();

app.use(logger('dev'));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(cors({ origin: [/localhost/, /\.onrender\.com$/] }));

app.get('/ping', (req, res) => {
  res.sendStatus(204);
});

app.use(
  yoga.graphqlEndpoint,
  helmet.contentSecurityPolicy({
    directives: {
      'style-src': ["'self'", 'unpkg.com', "'unsafe-inline'"],
      'script-src': ["'self'", 'unpkg.com', "'unsafe-inline'"],
      'img-src': ["'self'", 'raw.githubusercontent.com'],
      'connect-src': ["'self'", 'unpkg.com'],
      'worker-src': ["'self'", 'blob:'],
    },
  }),
  yoga
);


app.use('/api/auth', authRouter);

app.use('/api/expenses',  requireAuth, expensesRouter);
app.use('/api/users', requireAuth, usersRouter);
app.use("/api/categories", requireAuth, categoriesRouter);




app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});

export default app;
