import { PasswordHash } from './types';
import { randomBytes, createHmac} from 'crypto';

/**
 * Generates a cryptographic hash
 *
 * @param length {Number} Length of the resulting hash. Default: 16
 *
 * @return {string}
 */
export function getSalt(length = 16): string {
  return randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

/**
 * Creating a salted password hash
 * @param password {String} The password to hash
 * @param salt {String} The salt used for hashing
 *
 * @return {PasswordHash} the resulting hash and the salt
 */
export function saltHashPassword(password: string, salt: string): PasswordHash {
  return {
    salt: salt,
    hash: createHmac('sha512', salt).update(password).digest('hex')
  };
}
