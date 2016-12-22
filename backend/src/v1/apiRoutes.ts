import * as express from 'express';
import { registrationHandler, establishSessionHandler, getStatusHandler, terminate } from './handlers';

let routes = express.Router();

routes.post('/user', registrationHandler, terminate);
routes.post('/session', establishSessionHandler, terminate);
routes.get('/status', getStatusHandler, terminate);

export const APIRoutes = routes;
