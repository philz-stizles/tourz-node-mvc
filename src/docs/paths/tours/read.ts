export default {
  get: {
    tags: ['Tours'],
    description: 'Get a tour',
    operationId: 'getTour',
    parameters: [
      // expected params.
      {
        name: 'slug', // name of the param
        in: 'path', // location of the param, the in property which can be path, header, query, or cookie.
        schema: {
          $ref: '#/components/schemas/slug', // data model of the param
        },
        required: true, // Mandatory param
        description: 'A single tour slug', // param desc.
      },
    ],
    // expected responses
    responses: {
      200: {
        description: 'Tour retrieved',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Tour',
            },
          },
        },
      },
      404: {
        description: 'Tour was not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
    },
  },
};
