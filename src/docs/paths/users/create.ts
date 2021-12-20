export default {
  post: {
    summary: 'Create a new category',
    tags: ['Users'],
    description: 'Create a new sub-category',
    // operationId: '',
    parameters: [],
    requestBody: {
      // expected request body
      required: true,
      content: {
        // content-type
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UserInput', // todo input data model
          },
        },
      },
    },
    responses: {
      '201': {
        description: 'User was created successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Response',
            },
          },
        },
      },
      401: { description: 'Unauthorized access' },
      404: { description: 'Dependency was not found' },
      500: { description: 'Server error' },
    },
  },
};
