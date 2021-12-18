const { catchAsync } = require('../utils/api.utils');
const AppError = require('../errors/app.error');
const { APIFeatures } = require('../utils/api.utils');

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const newModel = await Model.create(req.body);

    res
      .status(201)
      .json({ status: true, data: newModel, message: 'created successfully' });
  });

exports.getOne = (Model, populate) =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id);

    if (populate) {
      query.populate(populate);
    }

    const existingModel = await query;

    if (!existingModel)
      return next(new AppError('Resource does not exist', 404));

    res.json({
      status: true,
      data: existingModel,
      message: 'retrieved successfully',
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const models = await features.query;

    res.json({
      status: true,
      data: {
        items: models,
        count: models.length,
      },
      message: 'retrieved successfully',
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError('Resource does not exist', 404));

    res
      .status(204)
      .json({ status: true, data: null, message: 'Deleted successfully' });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    const updatedModel = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedModel)
      return next(new AppError('Resource does not exist', 404));

    res.json({
      status: true,
      data: updatedModel,
      message: 'Updated successfully',
    });
  });
