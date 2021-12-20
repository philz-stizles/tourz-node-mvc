export default {
  put: {
    tags: ['Tours'],
    description: 'Update a new tour',
    operationId: 'updateTour',
    parameters: [
      // expected params
      {
        name: 'id', // name of param
        in: 'path', // location of param
        schema: {
          $ref: '#/components/schemas/id', // id model
        },
        required: true, // mandatory
        description: 'Id of tour to be updated', // short desc.
      },
    ],
    requestBody: {
      // expected request body
      content: {
        // content-type
        'application/json': {
          schema: {
            $ref: '#/components/schemas/TourInput', // todo input data model
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Tour updated successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Response',
            },
          },
        },
      },
      // response code
      404: {
        description: 'Tour not found', // response desc.
      },
      // response code
      500: {
        description: 'Server error', // response desc.
      },
    },
  },
};
