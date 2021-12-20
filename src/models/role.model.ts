import { model, Model, Schema, Document } from 'mongoose';

interface IRole {
  name: string;
  description: string;
  permissions: any[];
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface IRoleDocument extends IRole, Document {}

export interface IRoleModel extends Model<IRoleDocument> {}

const roleSchema = new Schema(
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
    },
    permissions: [],
    isActive: { type: Boolean, default: true, select: false },
  },
  { timestamps: true }
);

export default model<IRoleDocument, IRoleModel>('Role', roleSchema);
