export default {
  get: {
    tags: ['Audit'],
    description: 'Get all sub-categories',
    // operationId: 'getTodos',
    parameters: [],
    responses: {
      '200': {
        description: 'Todos were obtained',
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
