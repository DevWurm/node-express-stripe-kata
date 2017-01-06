import { Request, Response, NextFunction } from 'express-serve-static-core';

/**
 * Express middleware for terminating a request
 * @param req {Request}
 * @param res {Response}
 * @param next {NextFunction}
 */
export function terminate(req: Request, res: Response, next: NextFunction) {
  res.end();
}

export * from './registration';
export * from './session';
export * from './status';
export * from './payment';
export * from './version';
