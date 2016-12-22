import * as express from 'express';
import * as cors from 'cors';
import { NextFunction, Response, Request } from 'express-serve-static-core';
import { APIRoutes as v1APIRoutes } from './v1/apiRoutes';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
const bearerToken = require('express-bearer-token');

// setup express application
export const app = express();

// setup Cross-Origin-Resource-Sharing (CORS)
app.use(cors());

// setup logging
app.use(morgan('dev'));

// setup parsing for json bodies
app.use(bodyParser.json());
app.use(bearerToken());

// API V1 routes
app.use('/api/v1', v1APIRoutes);

// Handle not matching routes
app.use(function(req, res, next) {
  res.status(404).json({error: 'Page not found'}).end();
});

// Handle Server Errors
app.use((err: any, req: Request, res: Response, next: NextFunction ) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }
  res.status(err.status || 500).json({error: (err.message || 'Internal server error')}).end();
});
