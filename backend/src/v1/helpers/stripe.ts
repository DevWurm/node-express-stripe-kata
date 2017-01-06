import { stripe } from './providers';
import { extend } from './util';

export function createCharge(amount, token, email): Promise<number> {
  // TODO: charge the provided token and return the charged amount as promise
}

export function getCustomer(id: string): Promise<any> {
  return new Promise((resolve, reject) => {
    stripe.customers.retrieve(
      id,
      (err, customer) => {
        if (err) {
          console.error(err);
          return reject(extend(new Error('Error while receiving user from payment service'), { status: 500 }));
        }

        resolve(customer);
      }
    );
  });
}

export function updateCustomer(id: string, diff: any): Promise<{}> {
  return new Promise((resolve, reject) => {
    stripe.customers.update(
      id,
      diff,
      (err, _) => {
        if (err) {
          console.error(err);
          return reject(extend(new Error('Error while updating user at payment service'), { status: 500 }));
        }

        resolve();
      });
  });
}