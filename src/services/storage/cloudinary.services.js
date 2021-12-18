const { v2: cloudinary } = require('cloudinary');
const { finished } = require('stream/promises');

// config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure: true
});

// req.files.file.path
exports.uploadFile = async file => {
  try {
    return await cloudinary.uploader.upload(file, {
      public_id: `${Date.now()}`,
      resource_type: 'auto', // jpeg, png
    });
  } catch (error) {
    console.log(error.message);
    return { error };
  }
};

exports.uploadStream = async createReadStream => {
  const stream = cloudinary.uploader.upload_stream(
    {
      resource_type: 'auto', // jpeg, png
      folder: 'buyemall',
    },
    function (error, result) {
      console.log(error, result);
    }
  );

  createReadStream().pipe(stream);
  await finished(stream);
};

// eslint-disable-next-line no-unused-vars
exports.removeFile = (imageId, cb) => {
  cloudinary.uploader.destroy(imageId, (err, result) => {
    if (err) return cb(err, null);
    return cb(null, result);
  });
};
