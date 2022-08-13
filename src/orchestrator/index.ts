/* eslint-disable max-statements */
/* eslint-disable complexity */
import { RDSDataClient } from '@aws-sdk/client-rds-data';
import { APIGatewayEvent } from 'aws-lambda';
import { deleteBook } from '../operations/deleteBook';
import { getBook } from '../operations/getBook';
import { getBooks } from '../operations/getBooks';
import { getFilteredBooks } from '../operations/getFiltered';
import { patchBook } from '../operations/patchBook';
import { postBooks } from '../operations/postBooks';
import { IOperationOutput, IResponse } from '../types';

const createResponse = (statusCode:number, body: any): IResponse => {
  const response: IResponse = {
    statusCode: statusCode,
    isBase64Encoded: false,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
  return response;
};

const getIsbn = (event:APIGatewayEvent) => {
  if (event.pathParameters?.isbn) return event.pathParameters.isbn;
  return false;
};

const getOffset = (event:APIGatewayEvent) => {
  if (event.pathParameters?.offset) return event.pathParameters.offset;
  return false;
};

export const orchestrate = async (event:APIGatewayEvent, client:RDSDataClient ) => {
  try {

    const isbn = getIsbn(event);

    switch (event.requestContext.httpMethod) {
      case 'GET': {
        // getBook
        if (isbn) {
          const result: IOperationOutput = await getBook(isbn, client);
          return createResponse(result.statusCode, result.output);
        }

        const offset = getOffset(event);

        // getFilteredBooks
        if (offset && event.queryStringParameters) {
          const result: IOperationOutput = await getFilteredBooks(Number(offset), event.queryStringParameters, client);
          return createResponse(result.statusCode, result.output);
        }

        // getBooks
        if (offset) {
          const result: IOperationOutput = await getBooks(Number(offset), client);
          return createResponse(result.statusCode, result.output);
        }
      }

      case 'POST': {
        // postBooks
        if (event.body) {
          const result: IOperationOutput = await postBooks(event.body, client);
          return createResponse(result.statusCode, result.output);
        }
      }

      case 'PATCH': {
        // patchBooks
        if (isbn && event.body) {
          const result: IOperationOutput = await patchBook(isbn, event.body, client);
          return createResponse(result.statusCode, result.output);
        }
      }

      case 'DELETE': {
        // deleteBooks
        if (isbn) {
          const result: IOperationOutput = await deleteBook(isbn, client);
          return createResponse(result.statusCode, result.output);
        }
      }

      default: throw Error('Method not found');
    }
  } catch (error) {
    if (process.env.DEBUG == 'true') {
      console.log('Error: ', error);
    }
    return createResponse(400, { message:'Bad Request' });
  }
};