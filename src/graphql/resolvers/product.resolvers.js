const fs = require('fs');
const { finished } = require('stream/promises');
const { PubSub } = require('graphql-subscriptions');
const { AuthenticationError } = require('apollo-server-express');
const cloudinary = require('../../services/storage/cloudinary.services');

const pubsub = new PubSub();

exports.productMutations = {
  createProduct: async (_parent, args, context) => {
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

    const createdProduct = await dataSources.products.create(args.data);

    pubsub.publish('PRODUCT_CREATED', { createdProduct });

    return {
      statusCode: 201,
      message: 'Created successful',
      status: true,
      data: createdProduct,
    };
  },
  updateProduct: async (_parent, args, context) => {
    const updatedProduct = await context.dataSources.products.update(args.data);
    return {
      statusCode: 200,
      message: 'Updated successful',
      status: true,
      data: updatedProduct,
    };
  },
  archiveProduct: async (_parent, args, context) => {
    const archivedProduct = await context.dataSources.products.archive(args.id);
    return {
      statusCode: 200,
      message: 'Archived successful',
      status: true,
      data: archivedProduct,
    };
  },
  uploadProductFile: async (_parent, args, context) => {
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
  removeProductFile: async (_parent, args, context) => {
    if (!context.isAuthenticated) {
      throw new AuthenticationError('Please register to complete this process');
    }
    // Remove file = require(the cloud

    return {
      statusCode: 200,
      message: 'Removed successfully',
      status: true,
    };
  },
};

exports.productQueries = {
  async products(_parent, _args, context) {
    return await context.dataSources.products.list();
  },
};

exports.productSubscriptions = {
  createdProduct: {
    subscribe: () => pubsub.asyncIterator(['PRODUCT_CREATED']),
  },
};
