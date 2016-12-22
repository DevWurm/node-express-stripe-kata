import { Request, Response, NextFunction } from 'express-serve-static-core';
import { extend, match } from '../helpers/util';
import { verifyToken } from '../helpers/crypto';
import { TokenExpired, TokenInvalid } from '../helpers/types';
import { mongodb, stripe } from '../helpers/providers';

export function getStatusHandler(req: Request & { token?: string }, res: Response, next: NextFunction) {
  return new Promise((resolve, reject) => {
    // authenticate user
    if (!req.token) {
      reject(extend(new Error('No session token provided'), { status: 400 }));
    }

    const verification = verifyToken(req.token);

    console.log(verification)
    if (match(verification, TokenExpired)) {
      reject(extend(new Error(`Token is expired since ${verification.expiredAt}`), { status: 403 }));
    } else if (match(verification, TokenInvalid)) {
      reject(extend(new Error('Token is invalid'), { status: 403 }));
    } else {
      // if no verification error occurred, the verification result is the payload email
      resolve(verification);
    }
  })
    .then(email => {
      // get user entry
      return mongodb.then(db => {
        return db
          .find({
            email: email
          }).toArray();
      });
    })
    .then(result => {
      // get users stripe id
      if (result.length > 1) {
        return Promise.reject(extend(new Error('Invalid State: Multiple accounts found'), { status: 500 }));
      } else if (result.length < 1) {
        return Promise.reject(extend(new Error('Invalid State: No account found'), { status: 500 }));
      }

      return result[0].stripeId;
    })
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