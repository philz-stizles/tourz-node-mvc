import { Schema, model, Types, Document, PopulatedDoc, Model } from 'mongoose';
import { IUserDocument } from '@src/models/user.model';

interface IAudit {
  action: string;
  ip: string;
  method: string;
  type: string;
  payload: string;
  createdBy: PopulatedDoc<IUserDocument & Document>;
  createdAt: Date;
}

export interface IAuditDocument extends IAudit, Document {}

interface IAuditModel extends Model<IAuditDocument> {}

const schema = new Schema(
  {
    action: {
      type: String,
      trim: true,
      required: [true, 'An action is required'],
    },
    ip: { type: String, required: true },
    type: { type: String, required: true },
    method: { type: String, required: true },
    payload: String,
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model<IAuditDocument, IAuditModel>('Audit', schema);
