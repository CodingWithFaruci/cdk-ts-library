import { handler } from '../../src/index';
import { mockClient } from 'aws-sdk-client-mock';
import { RDSDataClient } from '@aws-sdk/client-rds-data';
import { invalidEvent } from './fixtures/events';
import { invalidEventResponse } from './fixtures/responses';

const rdsMockClient = mockClient(RDSDataClient);

describe('Invalid Methods', () => {
  beforeEach(() => {
    rdsMockClient.reset();
    process.env = Object.assign(process.env, { DEBUG: 'true' });
  });

  it('fails request because of invalid method', async () => {
    const result = await handler(invalidEvent);
    expect(result).toStrictEqual(invalidEventResponse);
  });
});