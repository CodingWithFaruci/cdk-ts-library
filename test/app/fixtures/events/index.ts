/* eslint-disable max-params */
/* eslint-disable complexity */
import { APIGatewayProxyEvent } from 'aws-lambda';

const createTestRequest = (method: string, isbn:any, body: any, offset:any, queryStringParameters: any) => {
  const request = {
    requestContext: { httpMethod: method },
    queryStringParameters: null,
  } as unknown as APIGatewayProxyEvent;
  if (isbn || offset) {
    if (!request.pathParameters) {
      request.pathParameters = {};
    }
    if (isbn) request.pathParameters.isbn = isbn;
    if (offset) request.pathParameters.offset = offset;
    if (queryStringParameters) request.queryStringParameters = queryStringParameters;
  }
  if (body) request.body = body;
  return request;
};

const noIsbnBody = {
  name: 'noIsbnBody',
  authors: ['faruk ada'],
  languages: ['dutch', 'english'],
  countries: ['the netherlands'],
  numberOfPages: 80,
  releaseDate: '2022',
};

const filterParams = {
  name: 'noIsbnBody',
  authors: '["book author"]',
  languages: '["french"]',
  countries: '["france"]',
  numberOfPages: '80',
  releaseDate: '2022',
};

const isbnBody = {
  isbn: '1234567890',
  name: 'isbnBody',
  authors: ['book author'],
  languages: ['french'],
  countries: ['france'],
  numberOfPages: 90,
  releaseDate: '2012',
};

const postSingleBook = JSON.stringify({ books: [isbnBody] });
const postMultipleBook = JSON.stringify({ books: [isbnBody, isbnBody] });

// Succes 200 requests
export const getBookEvent = createTestRequest('GET', '1234567890', null, null, null);
export const deleteBookEvent = createTestRequest('DELETE', '1234567890', null, null, null);

export const patchBookEvent = createTestRequest('PATCH', '1234567890', JSON.stringify(noIsbnBody), null, null);
export const getBooksEvent = createTestRequest('GET',  null, null, '10', null);

export const getFilteredBooksEvent = createTestRequest('GET', null, null, '10', filterParams);
export const postBookEvent = createTestRequest('POST', null, postSingleBook, null, null);
export const postBooksEvent = createTestRequest('POST', null, postMultipleBook, null, null);


// Fail 400 requests
export const getFilteredBooksInvalidEvent = createTestRequest('GET', null, null, '10', { test: '1' });
export const getFilteredBooksInvalid2Event = createTestRequest('GET', null, null, '10', { authors: '1' });

// Error 500 requests
export const deleteBookErrorEvent = createTestRequest('DELETE', 1, null, null, null);
export const invalidEvent = createTestRequest('GET', null, null, null, null);