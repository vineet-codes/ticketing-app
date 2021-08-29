import mongoose from 'mongoose';

import { Password } from '../services/password';

// this is an interface to describe the properties
// that are required to create an User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties that a User Document has
// UserDoc defines structure for what we get back from mongo when we interact with it
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// An interface that describes the properties that a User model has
// define what additional methods we add to mongo Model
interface UserModel extends mongoose.Model<UserDoc> {
  // use Build to create a new user which accepts
  // objects of UserAttrs type and return a user of UserDoc type
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// pre-save hook for monpgoDB,
// it automatically hash the password when attempting to save the details
// we get access to the document we save as this inside the function
// hence we need to define normal function and not arrow function
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// this is how we add functions/functionality to a mongoose model
// we have to define {UserAttrs and UserModel} interfaces, so that
// typescript helps us when we create new Users through the build function
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// we extend the model type with UserModel interface this way (<> using angle brackets)
// : need to learn some theory to internalize it
// all the middlewares (pre & post hooks), should be initialized before compiling the model
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// create a new user like below and typescript will help you everywhere in this application
// const user = User.build({
//   email: 'test@test.com',
//   password: 'password',
// });

export { User };
