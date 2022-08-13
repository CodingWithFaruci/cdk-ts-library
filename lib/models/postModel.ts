import { Stack } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export const createPostModel = (stack: Stack, api: apigateway.RestApi): apigateway.Model => {
  const model = new apigateway.Model(stack, 'IPost', {
    modelName: 'IPost',
    restApi: api,
    schema: {
      type: apigateway.JsonSchemaType.OBJECT,
      required: ['books'],
      properties: {
        books: {
          type: apigateway.JsonSchemaType.ARRAY,
          minItems: 1,
          maxItems: 10,
          items: {
            type: apigateway.JsonSchemaType.OBJECT,
            required: ['isbn', 'name', 'authors', 'languages', 'countries', 'numberOfPages', 'releaseDate'],
            properties: {
              isbn: { type: apigateway.JsonSchemaType.STRING },
              name: { type: apigateway.JsonSchemaType.STRING },
              authors: {
                type: apigateway.JsonSchemaType.ARRAY,
                minItems: 1,
                items: { type: apigateway.JsonSchemaType.STRING },
              },
              languages: {
                type: apigateway.JsonSchemaType.ARRAY,
                minItems: 1,
                items: { type: apigateway.JsonSchemaType.STRING },
              },
              countries: {
                type: apigateway.JsonSchemaType.ARRAY,
                minItems: 1,
                items: { type: apigateway.JsonSchemaType.STRING },
              },
              numberOfPages: { type: apigateway.JsonSchemaType.NUMBER },
              releaseDate: { type: apigateway.JsonSchemaType.STRING },
            },
          },
        },
      },
    },
  });
  return model;
};