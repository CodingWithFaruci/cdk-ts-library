import { ExecuteStatementCommand, ExecuteStatementCommandOutput, RDSDataClient } from '@aws-sdk/client-rds-data';
import { createRdsCommand } from '../client';
import { IOperationOutput } from '../types';
import { operationsOutput } from './operationsOutput';
import { getBooksQuery } from './queries';

export const getBooks = async (offset: number, client: RDSDataClient): Promise<IOperationOutput> => {
  try {
    const query: string = getBooksQuery(offset);

    const command: ExecuteStatementCommand = createRdsCommand(query);
    const data: ExecuteStatementCommandOutput = await Promise.resolve(client.send(command));
    const output: IOperationOutput = operationsOutput(200, data.formattedRecords as string);
    return output;

  } catch (error) {
    if (process.env.DEBUG == 'true') {
      console.log('Error getting books: ', error);
    }
    const output: IOperationOutput = operationsOutput(500, 'An error occured when getting books from library');
    return output;
  }
};