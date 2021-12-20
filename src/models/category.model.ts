import { Schema, model, Types, Document, PopulatedDoc, Model } from 'mongoose';
import { IUserDocument } from '@src/models/user.model';

export interface ICategory {
  name: string;
  slug: string;
  createdBy: PopulatedDoc<IUserDocument & Document>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryDocument extends ICategory, Document {}

export interface ICategoryModel extends Model<ICategoryDocument> {}

const schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
      minlength: [2, 'Too short'],
      maxlength: [32, 'Too long'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
      required: true,
    },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default model<ICategoryDocument, ICategoryModel>('Category', schema);
