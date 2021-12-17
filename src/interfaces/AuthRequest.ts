import { Request } from 'express';
import { IUserDocument } from '@src/models/user.model';

export interface IAuthRequest extends Request {
  user: IUserDocument;
}
