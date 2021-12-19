import { NextFunction, Request, Response } from 'express';

import { catchAsync } from '@src/utils/api.utils';
import AppError from '@src/errors/app.error';
import Tour from '@src/models/tour.model';
import * as factory from '@src/factories/handler.factory';

// USING HANDLER FACTORY
const createTour = factory.createOne(Tour);
const getAllTours = factory.getAll(Tour);
const getTour = factory.getOne(Tour, { path: 'reviews' });
const updateTour = factory.updateOne(Tour);
const deleteTour = factory.deleteOne(Tour);

// CONTROLLERS
// const searchTours = catchAsync(
//   async (req: Request, res: Response, _: NextFunction) => {
//     const searchTerm = req.query.search;

//     const tours = tours.filter(t => t.name.includes(searchTerm));

//     res
//       .status(200)
//       .json({ status: true, data: tours, message: 'retrieved successfully' });
//   }
// );

const getToursWithin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { distance: dist, latlng, unit } = req.params;
    if (!latlng || !dist)
      return next(
        new AppError(
          400,
          'Please provide latitude and longitude the the format lat,lng'
        )
      );

    const [lat, lng] = latlng.split(',');
    if (!lat || !lng)
      return next(
        new AppError(
          400,
          'Please provide latitude and longitude the the format lat,lng'
        )
      );

    const distance = parseInt(dist, 10);
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    const tours = await Tour.find({
      startLocation: {
        $geoWithin: { $centerSphere: [[lng, lat], radius] },
      },
    });

    res
      .status(200)
      .json({ status: true, data: tours, message: 'retrieved successfully' });
  }
);

const getDistances = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    if (!lat || !lng)
      return next(
        new AppError(
          400,
          'Please provide latitude and longitude the the format lat,lng'
        )
      );
    const multiplier = unit === 'mi' ? 0.0000621371 : 0.001;
    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseInt(lng, 10) * 1, parseInt(lat, 10) * 1],
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
    ]);

    res.status(200).json({
      status: true,
      data: distances,
      message: 'retrieved successfully',
    });
  }
);

// const getTourStats = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const stats = await Tour.aggregate([
//       {
//         $match: { ratingsAverage: { $lte: 4.5 } },
//       },
//       {
//         $group: {
//           // _id: null,
//           _id: { $toUpper: '$difficulty' },
//           // count: { $sum: 1 },
//           avgRating: { $avg: '$ratingsAverage' },
//           avgPrice: { $avg: '$price' },
//           minPrice: { $min: '$price' },
//           maxPrice: { $max: '$price' },
//         },
//       },
//       {
//         $sort: { avgPrice: -1 },
//       },
//     ]);

//     res.json({ status: true, data: stats, message: 'retrieved successfully' });
//   }
// );

// const getMonthlyPlan = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const year = +req.params.year;
//     const plan = await Tour.aggregate([
//       {
//         $unwind: '$startDates',
//       },
//       {
//         $match: {
//           startDates: {
//             $gte: new Date(`${year}-01-01`),
//             $lte: new Date(`${year}-12-31`),
//           },
//         },
//       },
//       {
//         $group: {
//           _id: { $month: '$startDates' },
//           numTourStarts: { $sum: 1 },
//           tours: { $push: '$name' },
//         },
//       },
//       {
//         $addFields: { month: '$_id' },
//       },
//       {
//         $project: { _id: 0 },
//       },
//       {
//         $sort: { numTourStarts: -1 },
//       },
//       {
//         $limit: 1,
//       },
//     ]);

//     res.json({ status: true, data: plan, message: 'retrieved successfully' });
//   }
// );

export {
  createTour,
  updateTour,
  getAllTours,
  getTour,
  deleteTour,
  // searchTours,
  // getTourStats,
  // getMonthlyPlan,
  getToursWithin,
  getDistances,
};
