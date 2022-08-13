import { handler } from '../../src/index';
import { mockClient } from 'aws-sdk-client-mock';
import { RDSDataClient, ServiceOutputTypes } from '@aws-sdk/client-rds-data';
import {
  getBookEvent,
  getBooksEvent,
  getFilteredBooksEvent,
  getFilteredBooksInvalid2Event,
  getFilteredBooksInvalidEvent,
} from './fixtures/events';
import {
  getBookErrorResponse,
  getBookRespons,
  getBooksErrorResponse,
  getBooksRespons,
  getFilteredBooksErrorResponse,
  getFilteredBooksInvalidErrorResponse,
  getFilteredBooksRespons,
} from './fixtures/responses';

const rdsMockClient = mockClient(RDSDataClient);

describe('Get Methods', () => {
  beforeEach(() => {
    rdsMockClient.reset();
    process.env = Object.assign(process.env, { DEBUG: 'true' });
  });

  // get book
  it('succesfully gets a book with given isbn', async () => {
    const mockResult: ServiceOutputTypes  = { $metadata: {}, formattedRecords: 'book' };
    rdsMockClient.send.resolves(mockResult);
    const result = await handler(getBookEvent);
    expect(result).toStrictEqual(getBookRespons);
  });

  it('fails to get a book because of database error', async () => {
    rdsMockClient.send.rejects(new Error('error getting book with isbn'));
    const result = await handler(getBookEvent);
    expect(result).toStrictEqual(getBookErrorResponse);
  });

  // get books
  it('succesfully gets all books', async () => {
    const mockResult: ServiceOutputTypes  = { $metadata: {}, formattedRecords: 'books' };
    rdsMockClient.send.resolves(mockResult);
    const result = await handler(getBooksEvent);
    expect(result).toStrictEqual(getBooksRespons);
  });

  it('fails getting books because of database error', async () => {
    rdsMockClient.send.rejects(new Error('error getting books'));
    const result = await handler(getBooksEvent);
    expect(result).toStrictEqual(getBooksErrorResponse);
  });

  // get books with
  it('succesfully gets books with given filter', async () => {
    const mockResult: ServiceOutputTypes  = { $metadata: {}, formattedRecords: 'filtered books' };
    rdsMockClient.send.resolves(mockResult);
    const result = await handler(getFilteredBooksEvent);
    expect(result).toStrictEqual(getFilteredBooksRespons);
  });

  it('fails to gets books with given invalid filter with unknown key', async () => {
    const result = await handler(getFilteredBooksInvalidEvent);
    expect(result).toStrictEqual(getFilteredBooksInvalidErrorResponse);
  });

  it('fails to gets books with given invalid filters with string as array', async () => {
    const result = await handler(getFilteredBooksInvalid2Event);
    expect(result).toStrictEqual(getFilteredBooksInvalidErrorResponse);
  });

  it('fails getting books with filters because of database error', async () => {
    rdsMockClient.send.rejects(new Error('error getting books'));
    const result = await handler(getFilteredBooksEvent);
    expect(result).toStrictEqual(getFilteredBooksErrorResponse);
  });

});