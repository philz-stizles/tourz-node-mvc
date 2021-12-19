import { IUpload } from '../interfaces';

export interface ITourCreate {
  title: string;
  description: string;
  price: number;
  category: string;
  subs: string[];
  quantity: number;
  images: IUpload[];
  shipping: boolean;
  color: string[];
  brand: string;
}

export interface ITourUpdate {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subs: string[];
  quantity: number;
  images: IUpload[];
  shipping: boolean;
  color: string[];
  brand: string;
}
