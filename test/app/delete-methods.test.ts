import { handler } from '../../src/index';
import { mockClient } from 'aws-sdk-client-mock';
import { RDSDataClient } from '@aws-sdk/client-rds-data';
import { deleteBookEvent } from './fixtures/events';
import { deletBookResponse, deleteBookErrorResponse } from './fixtures/responses';

const rdsMockClient = mockClient(RDSDataClient);

describe('Delete Methods', () => {
  beforeEach(() => {
    rdsMockClient.reset();
    process.env = Object.assign(process.env, { DEBUG: 'true' });
  });

  it('succesfully deletes a book with given isbn', async () => {
    const result = await handler(deleteBookEvent);
    expect(result).toStrictEqual(deletBookResponse);
  });

  it('fails to delete a book because of database error', async () => {
    rdsMockClient.send.rejects(new Error('error deleting books'));
    const result = await handler(deleteBookEvent);
    expect(result).toStrictEqual(deleteBookErrorResponse);
  });
});