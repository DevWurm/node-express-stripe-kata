import * as express from 'express';
import * as cors from 'cors';
import { NextFunction, Response, Request } from 'express-serve-static-core';

// setup express application
const app = express();

// setup Cross-Origin-Resource-Sharing (CORS)
app.use(cors());

// Handle not matching routes
app.use(function(req, res, next) {
  res.status(404).json({error: 'Page not found'}).end();
});

// Handle Server Errors
app.use((err: any, req: Request, res: Response, next: NextFunction ) => {
  res.status(err.status || 500).json({error: (err.message || 'Internal server error')}).end();
});

export default app;