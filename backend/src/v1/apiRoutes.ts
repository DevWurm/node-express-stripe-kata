import * as express from 'express';
import { registrationHandler, establishSessionHandler, terminate } from './handlers';

let routes = express.Router();

routes.post('/user', registrationHandler, terminate);
routes.post('/session', establishSessionHandler, terminate);

export const APIRoutes = routes;
