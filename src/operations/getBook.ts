import { ExecuteStatementCommand, ExecuteStatementCommandOutput, RDSDataClient } from '@aws-sdk/client-rds-data';
import { createRdsCommand } from '../client';
import { IOperationOutput } from '../types';
import { operationsOutput } from './operationsOutput';
import { getBookQuery } from './queries';

export const getBook = async (isbn: string, client: RDSDataClient): Promise<IOperationOutput> => {
  try {
    const query: string = getBookQuery(isbn);

    const command: ExecuteStatementCommand = createRdsCommand(query);
    const data: ExecuteStatementCommandOutput = await Promise.resolve(client.send(command));
    const output: IOperationOutput = operationsOutput(200, data.formattedRecords as string);
    return output;

  } catch (error) {
    if (process.env.DEBUG == 'true') {
      console.log('Error getting book: ', error);
    }
    const output: IOperationOutput = operationsOutput(500, `Error getting book with isbn: ${isbn} from library`);
    return output;
  }
};