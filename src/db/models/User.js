import { Schema, model } from 'mongoose';
import { emailRegex } from '../../constants/user.js';
import { handleSaveError, setUpdateSettings } from './hooks.js';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    match:emailRegex,
    required: true,
    unique:true,
  },
  password: {
    type: String,
    required: true,
  },
},
{
    versionKey:false,
    timestamps:true,
});

  userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};


userSchema.post('save', handleSaveError);
userSchema.pre('findOneAndUpdate', setUpdateSettings);
userSchema.post('findOneAndUpdate', handleSaveError);

 const UserCollection = model('user', userSchema);

 export default UserCollection;
