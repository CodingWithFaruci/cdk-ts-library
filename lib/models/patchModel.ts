import { Stack } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export const createPatchModel = (stack: Stack, api: apigateway.RestApi): apigateway.Model => {
  const model = new apigateway.Model(stack, 'IPatch', {
    modelName: 'IPatch',
    restApi: api,
    schema: {
      type: apigateway.JsonSchemaType.OBJECT,
      required: ['name', 'authors', 'languages', 'countries', 'numberOfPages', 'releaseDate' ],
      properties: {
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
  });
  return model;
};