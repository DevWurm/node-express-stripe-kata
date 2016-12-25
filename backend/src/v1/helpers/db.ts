import { DbUser } from './types';
import { mongodb } from './providers';

export function getUserByEmail(email: string): Promise<DbUser> {
  return mongodb.then(db => {
    return db
      .find({
        email: email
      }).toArray();
  })
    .then(result => {
      // get users stripe id
      if (result.length > 1) {
        return Promise.reject(new Error('Invalid State: Multiple accounts found'));
      } else if (result.length < 1) {
        return Promise.reject(new Error('Invalid State: No account found'));
      }

      return result[0];
    });
}
