import { handler } from '../../src/index';
import { mockClient } from 'aws-sdk-client-mock';
import { RDSDataClient } from '@aws-sdk/client-rds-data';
import { postBookEvent, postBooksEvent } from './fixtures/events';
import { postBookErrorResponse, postBookResponse, postBooksResponse } from './fixtures/responses';

const rdsMockClient = mockClient(RDSDataClient);

describe('Post Methods', () => {
  beforeEach(() => {
    rdsMockClient.reset();
    process.env = Object.assign(process.env, { DEBUG: 'true' });
  });

  it('succesfully posts a single book with given body', async () => {
    const result = await handler(postBookEvent);
    console.log('post event: ', postBookEvent);
    expect(result).toStrictEqual(postBookResponse);
  });

  it('succesfully posts multiple books with given body', async () => {
    const result = await handler(postBooksEvent);
    expect(result).toStrictEqual(postBooksResponse);
  });

  it('fails posting book(s) because of database error', async () => {
    rdsMockClient.send.rejects(new Error('error posting book(s)'));
    const result = await handler(postBookEvent);
    expect(result).toStrictEqual(postBookErrorResponse);
  });
});