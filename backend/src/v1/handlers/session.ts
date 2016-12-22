import { Response, Request, NextFunction } from 'express-serve-static-core';
import { isUserCredentials } from '../helpers/types';
import { extend } from '../helpers/util';
import { normalizeEmail } from 'validator';
import { mongodb } from '../helpers/providers';
import { saltHashPassword, createToken } from '../helpers/crypto';
import { getUserByEmail } from '../helpers/db';

/**
 * Express middleware for establishing a user session via a JWT session token
 * @param req
 * @param res
 * @param next
 */
export function establishSessionHandler(req: Request, res: Response, next: NextFunction): void {
  // validate user input
  if (!req.body || !isUserCredentials(req.body)) {
    return next(extend(new Error('No credentials provided'), { status: 400 }));
  } else {
    req.body.email = normalizeEmail(req.body.email) || null;
  }

  getUserByEmail(req.body.email)
    .catch(reason => Promise.reject(extend(reason, {status: 500})))
    .then(user => {
      return user.password.hash === saltHashPassword(req.body.password, user.password.salt).hash;
    })
    .then(correct => {
      if (correct) {
        res.status(201);
        res.json({ token: createToken(req.body.email) });
        next();
      } else {
        return Promise.reject(extend(new Error('Incorrect credentials'), { status: 400 }));
      }
    }).catch(reason => {
    next(reason);
  });
}
