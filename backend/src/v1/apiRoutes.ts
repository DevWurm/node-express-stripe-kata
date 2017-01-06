import * as express from 'express';
import { registrationHandler, establishSessionHandler, getStatusHandler, paymentHandler, versionHandler, terminate } from './handlers';

let routes = express.Router();

routes.post('/user', registrationHandler, terminate);
routes.post('/session', establishSessionHandler, terminate);
routes.get('/status', getStatusHandler, terminate);
routes.post('/payment', paymentHandler, terminate);
routes.get('/version', versionHandler, terminate);

export const APIRoutes = routes;
