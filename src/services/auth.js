import { userCollection } from '../db/models/User.js';

 const register = async (payload) => {
  return userCollection.create(payload);
};


export default register;
