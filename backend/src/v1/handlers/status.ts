import { Request, Response, NextFunction } from 'express-serve-static-core';
import { extend, match } from '../helpers/util';
import { verifyToken } from '../helpers/crypto';
import { TokenExpired, TokenInvalid } from '../helpers/types';
import { mongodb, stripe } from '../helpers/providers';
import { getUserByEmail } from '../helpers/db';

export function getStatusHandler(req: Request & { token?: string }, res: Response, next: NextFunction) {
  return new Promise((resolve, reject) => {
    // authenticate user
    if (!req.token) {
      reject(extend(new Error('No session token provided'), { status: 400 }));
    }

    const verification = verifyToken(req.token);

    if (match(verification, TokenExpired)) {
      reject(extend(new Error(`Token is expired since ${verification.expiredAt}`), { status: 403 }));
    } else if (match(verification, TokenInvalid)) {
      reject(extend(new Error('Token is invalid'), { status: 403 }));
    } else {
      // if no verification error occurred, the verification result is the payload email
      resolve(verification);
    }
  })
    .then((email: string) => {
      return getUserByEmail(email);
    })
    .catch(reason => Promise.reject(extend(reason, {status: 500})))
    .then(user => user.stripeId)
    .then((stripeId: string) => {
      // get users credits
      return new Promise((resolve, reject) => {
        stripe.customers.retrieve(stripeId, (err, customer) => {
          if (err) {
            console.error(err);
            return reject(extend(new Error('Error while receiving user from payment service'), {status: 500}));
          }

          resolve(Number(customer.metadata.credits));
        });
      });
    })
    .then(credits => {
      res.status(200);
      res.json({credits});
      next();
    })
    .catch(reason => next(reason));
}