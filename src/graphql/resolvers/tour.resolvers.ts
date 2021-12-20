/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import { finished } from 'stream/promises';
import { PubSub } from 'graphql-subscriptions';
import { ITourDocument } from '@src/models/tour.model';
import { AuthenticationError } from 'apollo-server-express';
import { IResponse, IUpload } from '../interfaces';
import * as cloudinary from '@src/services/storage/cloudinary.services';

const pubsub = new PubSub();

export interface ITourResponse extends IResponse {
  data: ITourDocument;
}

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

export const tourMutations = {
  createTour: async (
    _parent: any,
    args: any,
    context: any
  ): Promise<ITourResponse> => {
    const { isAuthenticated, dataSources } = context;
    if (!isAuthenticated) {
      throw new AuthenticationError('Please register to complete this process');
    }

    const { images } = args.data;

    console.log('images', images);

    if (images) {
      const { createReadStream, filename, mimetype, encoding } = await images;

      console.log('resolver', filename);

      // Invoking the `createReadStream` will return a Readable Stream.
      // See https://nodejs.org/api/stream.html#stream_readable_streams
      const stream = createReadStream();

      // This is purely for demonstration purposes and will overwrite the
      // local-file-output.txt in the current working directory on EACH upload.
      const out = fs.createWriteStream('local-file-output.txt');
      stream.pipe(out);
      await finished(out);
    }

    const createdTour = await dataSources.tours.create(args.data);

    pubsub.publish('TOUR_CREATED', { createdTour });

    return {
      statusCode: 201,
      message: 'Created successful',
      status: true,
      data: createdTour,
    };
  },
  updateTour: async (
    _parent: any,
    args: any,
    context: any
  ): Promise<ITourResponse> => {
    const updatedTour = await context.dataSources.tours.update(args.data);
    return {
      statusCode: 200,
      message: 'Updated successful',
      status: true,
      data: updatedTour,
    };
  },
  archiveTour: async (
    _parent: any,
    args: any,
    context: any
  ): Promise<ITourResponse> => {
    const archivedTour = await context.dataSources.tours.archive(args.id);
    return {
      statusCode: 200,
      message: 'Archived successful',
      status: true,
      data: archivedTour,
    };
  },
  uploadTourFile: async (
    _parent: any,
    args: any,
    context: any
  ): Promise<IResponse> => {
    if (!context.isAuthenticated) {
      throw new AuthenticationError('Please register to complete this process');
    }

    const { upload } = args;

    console.log(upload);

    if (upload) {
      const { createReadStream, filename, mimetype, encoding } = await upload;

      // Store file in the cloud
      cloudinary.uploadStream(createReadStream);
    }

    return {
      statusCode: 201,
      message: 'Uploaded successfully',
      status: true,
    };
  },
  removeTourFile: async (
    _parent: any,
    args: any,
    context: any
  ): Promise<IResponse> => {
    if (!context.isAuthenticated) {
      throw new AuthenticationError('Please register to complete this process');
    }
    // Remove file from the cloud

    return {
      statusCode: 200,
      message: 'Removed successfully',
      status: true,
    };
  },
};

export const tourQueries = {
  async tours(
    _parent: any,
    _args: any,
    context: any
  ): Promise<ITourDocument[]> {
    return await context.dataSources.tours.list();
  },
};

export const tourSubscriptions = {
  createdTour: {
    subscribe: () => pubsub.asyncIterator(['TOUR_CREATED']),
  },
};
