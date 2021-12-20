import { Schema, model, Types, Document, PopulatedDoc, Model } from 'mongoose';
import { IUserDocument } from './user.model';

interface ICoupon {
  code: string;
  expiry: Date;
  discount: number;
  isActive: boolean;
  createdBy: PopulatedDoc<IUserDocument & Document>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICouponDocument extends ICoupon, Document {}

interface ICouponModel extends Model<ICouponDocument> {
  findByAuthentication(email: string, password: string): Promise<void | any>;
}

const schema = new Schema(
  {
    code: {
      type: String,
      trim: true,
      unique: true,
      uppercase: true,
      required: [true, 'Name is required'],
      minlength: [6, 'Too short'],
      maxlength: [12, 'Too long'],
    },
    expiry: { type: Date, required: true },
    discount: { type: Number, required: true },
    isActive: { type: Boolean, required: true, default: false },
    createdBy: { type: Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default model<ICouponDocument, ICouponModel>('Coupon', schema);
