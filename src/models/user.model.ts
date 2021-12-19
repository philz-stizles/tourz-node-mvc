import crypto from 'crypto';
import { Model, Schema, model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { generateToken } from '@src/utils/auth.utils';

interface IUserToken {
  token: string;
}

// Create an interface representing a document in MongoDB.
interface IUser {
  _id: Types.ObjectId;
  fullname?: string;
  username: string;
  email: string;
  avatar?: string;
  password?: string;
  confirmPassword?: string;
  passwordChangedAt?: Date;
  passwordResetExpiresIn?: number;
  passwordResetToken: string | undefined;
  isActive: boolean;
  roles: string[];
  tokens: IUserToken[];
}

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
  generateToken: () => string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  createPasswordResetToken: () => string;
  isPasswordChangedAfterTokenGen: (issuedAt: number) => boolean;
  toJSON: () => any;
}

interface IUserModel extends Model<IUserDocument> {
  findByAuthentication(email: string, password: string): Promise<void | any>;
}

// Put as much business logic in the models to keep the controllers as simple and lean as possible
const userSchema = new Schema(
  {
    fullname: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
      lowercase: true,
    },
    avatar: { type: String, default: 'default.jpg' },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: 8,
      select: false,
    }, // Using select: false
    // will omit the field that it is assigned to from any read executions e.g find, findOne  etc.
    // It will not omit from create, save
    confirmPassword: {
      type: String,
      required: [true, 'Please confirm your password'],
      // validate: {
      //   // Note that this will only work with create() and save(), will not work on update, so you need to ensure that
      //   // you use save() to update the user
      //   validator: function (val: string): boolean {
      //     return val === this.password;
      //   },
      //   message: 'Passwords do not match',
      // },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpiresIn: Date,
    roles: [String],
    isActive: { type: Boolean, default: true, select: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre('save', async function (next) {
  // If password was not modified, do not encrypt
  if (!this.isModified('password')) return next();

  // Encrypt password
  this.password = await bcrypt.hash(this.password as string, 12);

  // Delete confirmPassword field
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  // If password was not modified, do not encrypt
  if (!this.isModified('password') || this.isNew) return next(); // When you change password or create a new user,
  // set passwordChange date

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

// userSchema.pre(/^find/, async function (next) {
//   // this points to the current query
//   const user = this as IUserDocument;
//   this.find({ isActive: { $ne: false } }); // Not equal to false is different from is equal to true
//   next();
// });

userSchema.methods.generateToken = function () {
  return generateToken({ id: this.id, email: this.email, roles: this.roles });
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password as string);
};

userSchema.methods.isPasswordChangedAfterTokenGen = function (jwtTimestamp) {
  if (!this.passwordChangedAt) return false;
  const passwordChangedAtInMilliseconds = this.passwordChangedAt.getTime();
  const passwordChangedAtInSeconds = parseInt(
    `${passwordChangedAtInMilliseconds / 1000}`,
    10
  );

  return passwordChangedAtInSeconds > jwtTimestamp;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpiresIn = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export default model<IUserDocument, IUserModel>('User', userSchema);
