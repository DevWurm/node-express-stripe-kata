import * as express from 'express';
import { registrationHandler, terminate } from './handlers';

let routes = express.Router();

routes.post('/user', registrationHandler, terminate);

export const APIRoutes = routes;
