import Tour from '@src/models/tour.model';

describe('Tour Model', () => {
  it('has all the required attributes', () => {
    const expectedKeys = [
      'name',
      'description',
      'summary',
      'imageCover',
      'images',
      'duration',
      'maxGroupSize',
      'secretTour',
      'startDates',
      'startLocation',
      'locations',
      'price',
      'discount',
      'ratingsAverage',
      'ratingsQuantity',
      'difficulty',
      'slug',
      'guides',
      'createdAt',
      'modifiedAt',
    ];
    const modelAttributes = Object.keys(Tour.schema.paths);
    expect(expectedKeys.every(key => modelAttributes.includes(key))).toEqual(
      true
    );
  });

  it('should create a new tour', async () => {
    try {
      // Create new mock Tour
      const newMockTour = {
        startLocation: {
          description: 'Miami, USA',
          type: 'Point',
          coordinates: [-80.185942, 25.774772],
          address: '301 Biscayne Blvd, Miami, FL 33132, USA',
        },
        ratingsAverage: 4.8,
        ratingsQuantity: 6,
        images: ['tour-2-1.jpg', 'tour-2-2.jpg', 'tour-2-3.jpg'],
        startDates: [
          '2021-06-19T09:00:00.000Z',
          '2021-07-20T09:00:00.000Z',
          '2021-08-18T09:00:00.000Z',
        ],
        name: 'The Sea Explorer',
        duration: 7,
        maxGroupSize: 15,
        difficulty: 'medium',
        guides: ['5c8a22c62f8fb814b56fa18b', '5c8a1f4e2f8fb814b56fa185'],
        price: 497,
        summary: 'Exploring the jaw-dropping US east coast by foot and by boat',
        description:
          'Excepteur sint occaecat cupidatat eserunt mollit anim id est laborum.\n Lorem sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis  in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        imageCover: 'tour-2-cover.jpg',
        locations: [
          {
            _id: '5c88fa8cf4afda39709c2959',
            description: 'Lummus Park Beach',
            type: 'Point',
            coordinates: [-80.128473, 25.781842],
            day: 1,
          },
        ],
      };
      // Save new mock Tour
      const createdMockTour = await new Tour(newMockTour).save();

      expect(createdMockTour._id).toBeDefined();
      expect(createdMockTour.name).toEqual(newMockTour.name);
      expect(createdMockTour.description).toEqual(newMockTour.description);
      expect(createdMockTour.summary).toEqual(newMockTour.summary);
      expect(createdMockTour.price).toEqual(newMockTour.price);
      expect(createdMockTour.slug).toBeDefined();
      expect(createdMockTour.createdAt).toBeDefined();
      expect(createdMockTour.modifiedAt).toBeDefined();
    } catch (err: any | unknown) {
      throw new Error(err);
    }
  });

  it('should throw an error if the title field is empty', async () => {
    try {
      await new Tour({
        name: '',
        slug: 'samsung_smart_phone',
        description: 'Some tour description',
        price: 23,
      }).save();
    } catch (err: any | unknown) {
      expect(err.errors.name.kind).toEqual('required');
    }
  });
});
