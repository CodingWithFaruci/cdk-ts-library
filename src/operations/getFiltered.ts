/* eslint-disable complexity */
import { ExecuteStatementCommand, ExecuteStatementCommandOutput, RDSDataClient } from '@aws-sdk/client-rds-data';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { createRdsCommand } from '../client';
import { IOperationOutput } from '../types';
import { operationsOutput } from './operationsOutput';
import { filteredBooksQuery } from './queries';

export const getFilteredBooks = async (
  offset: number,
  event: APIGatewayProxyEventQueryStringParameters,
  client: RDSDataClient,
): Promise<IOperationOutput> => {
  try {
    let queryCollection: string[] = filteredBooksQuery(event);

    if (queryCollection.length > 0) {
      const prefix: string = 'SELECT * FROM library WHERE';
      const suffix: string = ` LIMIT 10 OFFSET ${offset}`;
      const collectedFilters: string = queryCollection.join(' AND ');
      const query: string = prefix + collectedFilters + suffix;

      const command: ExecuteStatementCommand = createRdsCommand(query);
      const data: ExecuteStatementCommandOutput = await Promise.resolve(client.send(command));
      const output: IOperationOutput = operationsOutput(200, data.formattedRecords as string);
      return output;
    }

    const output: IOperationOutput = operationsOutput(400, 'No valid filters received');
    return output;

  } catch (error) {
    if (process.env.DEBUG == 'true') {
      console.log('Error getting filtered books: ', error);
    }
    const output: IOperationOutput = operationsOutput(500, 'An error occured when getting filtered books from library');
    return output;
  }
};