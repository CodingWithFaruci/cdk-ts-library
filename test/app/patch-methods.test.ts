import { handler } from '../../src/index';
import { mockClient } from 'aws-sdk-client-mock';
import { RDSDataClient } from '@aws-sdk/client-rds-data';
import { patchBookEvent } from './fixtures/events';
import { patchBookErrorResponse, patchBookResponse } from './fixtures/responses';

const rdsMockClient = mockClient(RDSDataClient);

describe('Patch Methods', () => {
  beforeEach(() => {
    rdsMockClient.reset();
    process.env = Object.assign(process.env, { DEBUG: 'true' });
  });

  it('succesfully patches a book with given isbn and body', async () => {
    const result = await handler(patchBookEvent);
    expect(result).toStrictEqual(patchBookResponse);
  });

  it('fails patching a book because of a database error', async () => {
    rdsMockClient.send.rejects(new Error('error patching book'));
    const result = await handler(patchBookEvent);
    expect(result).toStrictEqual(patchBookErrorResponse);
  });
});