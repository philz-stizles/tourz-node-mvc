module.exports = {
  post: {
    summary: 'Create a new category',
    tags: ['Categories'],
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
            $ref: '#/components/schemas/CategoryInput', // todo input data model
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Category was created successfully',
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
