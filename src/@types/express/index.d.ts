import { IUser } from '@src/models/user.model';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      file: any;
      files: {
        imageCover: any;
        images: any;
      }[];
    }
  }
}

declare global {
  namespace NodeJS {
    interface Global {
      __basedir: string;
    }
  }
}
