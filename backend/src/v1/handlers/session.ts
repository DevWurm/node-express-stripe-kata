import { Response, Request, NextFunction } from 'express-serve-static-core';
import { isUserCredentials } from '../helpers/types';
import { extend } from '../helpers/util';
import { normalizeEmail } from 'validator';
import { mongodb } from '../helpers/providers';
import { saltHashPassword, createToken } from '../helpers/crypto';

/**
 * Express middleware for establishing a user session via a JWT session token
 * @param req {Request}
 * @param res {Response}
 * @param next {NextFunction}
 */
export function establishSessionHandler(req: Request, res: Response, next: NextFunction): void {
  // validate user input
  if (!req.body || !isUserCredentials(req.body)) {
    return next(extend(new Error('No credentials provided'), { status: 400 }));
  } else {
    req.body.email = normalizeEmail(req.body.email) || null;
  }

  mongodb.then(db => {
    return db
      .find({
        email: req.body.email
      }).toArray();
  })
    .then(result => {
      if (result.length > 1) {
        return Promise.reject(extend(new Error('Invalid State: Multiple accounts found'), {status: 500}));
      } else if (result.length < 1) {
        return false;
      }

      return result[0].password.hash === saltHashPassword(req.body.password, result[0].password.salt).hash;
    })
    .then(correct => {
      if (correct) {
        res.status(201);
        res.json({token: createToken(req.body.email)});
        next();
      } else {
        return Promise.reject(extend(new Error('Incorrect credentials'), {status: 400}));
      }
    }).catch(reason => {
      next(reason);
  });
}
