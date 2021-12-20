import { IUserDocument } from '@src/models/user.model';

export interface ISignupCredentials {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface ILoggedInUser {
  _id: string;
  fullname?: string;
  email: string;
  token: string;
}

export interface ILoginResponse {
  code: string;
  success: boolean;
  message: string;
  data: ILoggedInUser;
}

export interface ISignupResponse {
  code: string;
  success: boolean;
  message: string;
  data: IUserDocument;
}
