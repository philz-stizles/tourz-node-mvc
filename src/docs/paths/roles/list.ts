export default {
  get: {
    tags: ['Roles'],
    description: 'Get all sub-categories',
    // operationId: 'getTodos',
    parameters: [],
    responses: {
      '200': {
        description: 'Roles were obtained',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SubCategoryInput',
            },
          },
        },
      },
    },
  },
};
