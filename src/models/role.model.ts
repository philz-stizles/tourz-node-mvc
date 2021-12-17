import { model, Model, Schema } from 'mongoose';
import validator from 'validator'; // Put as much business logic in the models to keep the controllers as simple and lean as possible

export interface IRole {
  name: string;
  description: string;
  permissions: any[];
  isActive: boolean;
  createdAt: any;
  modifiedAt: any;
}

export interface IRoleDocument extends IRole, Document {}

export interface IRoleModel extends Model<IRoleDocument> {}

const roleSchema = new Schema<IRoleDocument, IRoleModel>(
  {
    name: {
      type: String,
      required: [true, 'A role must have a name'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'A user must have an email'],
      trim: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    permissions: [],
    isActive: { type: Boolean, default: true, select: false },
  },
  { timestamps: true }
);

export default model<IRoleDocument, IRoleModel>('Role', roleSchema);
