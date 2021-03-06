import { Request, Response, NextFunction } from 'express-serve-static-core';
import { extend, match } from '../helpers/util';
import { verifyToken } from '../helpers/crypto';
import { TokenExpired, TokenInvalid } from '../helpers/types';
import { getUserByEmail } from '../helpers/db';
import { getCustomer } from '../helpers/stripe';

export function getStatusHandler(req: Request & { token?: string }, res: Response, next: NextFunction): void {
  // authenticate user
  if (!req.token) {
    return next(extend(new Error('No session token provided'), { status: 400 }));
  }

  const verification = verifyToken(req.token);

  if (match(verification, TokenExpired)) {
    return next(extend(new Error(`Token is expired since ${verification.expiredAt}`), { status: 403 }));
  } else if (match(verification, TokenInvalid)) {
    return next(extend(new Error('Token is invalid'), { status: 403 }));
  }

  getUserByEmail(verification)
    .catch(reason => Promise.reject(extend(reason, { status: 500 })))
    .then(user => user.stripeId)
    .then((stripeId: string) => getCustomer(stripeId))
    .then(customer => customer.metadata.credits)
    .then(credits => {
      res.status(200);
      res.json({ credits });
      next();
    })
    .catch(reason => next(reason));
}