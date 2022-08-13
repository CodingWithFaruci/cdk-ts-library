import { RDSDataClient } from '@aws-sdk/client-rds-data';
import { APIGatewayEvent } from 'aws-lambda';
import { createRdsClient } from './client';
import { orchestrate } from './orchestrator';
import { IResponse } from './types';

// defined here for lazy loading
let client: RDSDataClient;

export const handler = async (event:APIGatewayEvent) => {
  if (!client) {
    // lazy loading rds client
    client = await createRdsClient();
  }
  const response: IResponse = await orchestrate(event, client);
  return response;
};