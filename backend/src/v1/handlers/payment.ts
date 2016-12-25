import { Request, Response, NextFunction } from 'express-serve-static-core';
import { extend, match } from '../helpers/util';
import { stripe, mongodb } from '../helpers/providers';
import { verifyToken } from '../helpers/crypto';
import { TokenExpired, TokenInvalid } from '../helpers/types';
import { getUserByEmail } from '../helpers/db';

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

    new Promise((resolve, reject) => {
      // charge customer
      stripe.charges.create({
        amount: req.body.amount,
        currency: "eur",
        source: req.body.token, // obtained with Stripe.js
        description: `Credit charge for ${email}`
      }, (err, charge) => {
        if (err) {
          console.error(err);
          return reject(extend(new Error('Error while charging credit card'), { status: 500 }));
        }

        resolve(charge.amount);
      });
    })
      .then((amount: number) => {
        return getUserByEmail(email)
          .catch(reason => Promise.reject(extend(reason, { status: 500 })))
          .then(user => user.stripeId)
          .then(stripeId => {
            // get user data from stripe
            return new Promise((resolve, reject) => {
              stripe.customers.retrieve(
                stripeId,
                (err, customer) => {
                  if (err) {
                    console.error(err);
                    return reject(extend(new Error('Error while receiving user from payment service'), { status: 500 }));
                  }

                  resolve(customer);
                }
              );
            });
          })
          .then((customer: { id: string, metadata: { credits: number } }) => {
            // update user data at stripe
            return new Promise((resolve, reject) => {
              stripe.customers.update(
                customer.id,
                {
                  metadata: {
                    credits: customer.metadata.credits + amount
                  }
                },
                (err, _) => {
                  if (err) {
                    console.error(err);
                    return reject(extend(new Error('Error while updating user at payment service'), { status: 500 }));
                  }

                  resolve();
                });
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
