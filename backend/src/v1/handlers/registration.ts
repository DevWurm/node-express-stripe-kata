import { stripe, mongodb } from '../helpers/providers';
import { extend } from '../helpers/util';
import { isEmail, normalizeEmail } from 'validator';
import { isUserCredentials } from '../helpers/types';
import { saltHashPassword, getSalt } from '../helpers/crypto';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { ObjectID } from 'mongodb';

/**
 * Express middleware for registering a user to Stripe and the user store
 * @param req {Request}
 * @param res {Response}
 * @param next {NextFunction}
 */
export function registrationHandler(req: Request, res: Response, next: NextFunction): void {
  // validate credentials
  if (!req.body || !isUserCredentials(req.body)) {
    return next(extend(new Error('No credentials provided'), { status: 400 }));
  } else if (!isEmail(req.body.email)) {
    return next(extend(new Error('Invalid email address'), { status: 400 }));
  } else {
    req.body.email = normalizeEmail(req.body.email) || null;
  }

  // register user
  testForExistence(req, res)
    .then(_ => {
      // perform registration
      registerToStripe(req, res)
        .then(id => registerToUserStore(req, res, id))
        .then(() => {
          res.status(201);
          res.json({});
          next();
        })
        .catch(reason => {
          console.error(reason);
          next(extend(new Error('Registration failed'), { status: 500 }));
        });
    })
    .catch(reason => {
      console.error(reason);
      next(extend(reason, { status: 400 }));
    });
}

function testForExistence(req: Request, res: Response): Promise<boolean> {
  return mongodb.then(db => {
    return db
      .find({
        email: req.body.email
      }).toArray();
  })
    .then(result => {
      if (result.length > 0) {
        return Promise.reject(new Error('User already exists'));
      }
      return Promise.resolve(true);
    });
}

/**
 * Creates a new Stripe customer for the user, which is registering in the current request
 * @param req {Request}
 * @param res {Response}
 * @return {Promise<string>}
 */
function registerToStripe(req: Request, res: Response): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    stripe.customers.create({
      email: req.body.email,
      metadata: {
        credits: 0
      },
    }, (err, customer) => {
      if (err) {
        console.error(err);
        return reject(new Error('Error while creating user at payment service'));
      }
      resolve(customer.id);
    });
  });
}

/**
 * Writes the user, which is registering in the current request into the user store
 * @param req {Request}
 * @param res {Response}
 * @param stripeId {String}
 * @return {Promise<ObjectID>}
 */
function registerToUserStore(req: Request, res: Response, stripeId: string): Promise<ObjectID> {
  return mongodb.then(db => {
    return db.insertOne({
      email: req.body.email,
      password: saltHashPassword(req.body.password, getSalt()),
      stripeId
    }).then(result => {
      return result.insertedId;
    });
  });
}

