const stripe_gen = require('stripe');
import { MongoClient, Collection } from 'mongodb';

const e = process.env;

export const stripe: any = stripe_gen(e.STRIPE_SECRET_KEY);

export const mongodb: Promise<Collection> = MongoClient
  .connect(`mongodb://${e.MONGODB_USER}:${e.MONGODB_PASS}@`
    + `${e.MONGODB_ADDR}:${e.MONGODB_PORT || 27017}`
    + `/${e.MONGODB_DB}`)
  .then(db => {
    return db.collection(e.MONGODB_COLLECTION);
  });

mongodb.catch(reason => {
  console.error(reason);
});
