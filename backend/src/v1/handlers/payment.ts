import { Request, Response, NextFunction } from 'express-serve-static-core';
import { extend, match } from '../helpers/util';
import { verifyToken } from '../helpers/crypto';
import { TokenExpired, TokenInvalid } from '../helpers/types';
import { getUserByEmail } from '../helpers/db';
import { createCharge, getCustomer, updateCustomer } from '../helpers/stripe';

export function paymentHandler(req: Request & { token: string }, res: Response, next: NextFunction): void {
  // validate user input
  if (!req.token) {
    return next(extend(new Error('No session token provided'), { status: 400 }));
  } else if (!req.body.token) {
    return next(extend(new Error('No stripe Token provided'), { status: 400 }));
  } else if (!req.body.amount) {
    return next(extend(new Error('No amount provided'), { status: 400 }));
  }

  const verification = verifyToken(req.token);

  if (match(verification, TokenExpired)) {
    next(extend(new Error(`Token is expired since ${verification.expiredAt}`), { status: 403 }));
  } else if (match(verification, TokenInvalid)) {
    next(extend(new Error('Token is invalid'), { status: 403 }));
  } else {
    // if no verification error occurred, the verification result is the payload email
    const email = verification;

    createCharge(req.body.amount, req.body.token, email)
      .then((amount: number) => {
        return getUserByEmail(email)
          .catch(reason => Promise.reject(extend(reason, { status: 500 })))
          .then(user => user.stripeId)
          .then(stripeId => getCustomer(stripeId))
          .then((customer: { id: string, metadata: { credits: number } }) => {
            // update user data at stripe
            return updateCustomer(customer.id, {
              metadata: {
                credits: Number(customer.metadata.credits) + Number(amount)
              }
            });
          })
          .then(_ => {
            res.status(200);
            res.send({});
            next();
          })
          .catch(err => next(err));
      });
  }
}
