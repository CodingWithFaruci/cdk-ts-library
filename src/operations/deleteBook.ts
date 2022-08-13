import { ExecuteStatementCommand, RDSDataClient } from '@aws-sdk/client-rds-data';
import { createRdsCommand } from '../client';
import { IOperationOutput } from '../types';
import { operationsOutput } from './operationsOutput';
import { deleteBookQuery } from './queries';

export const deleteBook = async (isbn: string, client: RDSDataClient): Promise<IOperationOutput> => {
  try {
    const query: string = deleteBookQuery(isbn);

    const command: ExecuteStatementCommand = createRdsCommand(query);
    await client.send(command);
    const output: IOperationOutput = operationsOutput(200, `Deleted book with isbn: ${isbn} from library`);
    return output;

  } catch (error) {
    if (process.env.DEBUG == 'true') {
      console.log('Error deleting book: ', error);
    }
    const output: IOperationOutput = operationsOutput(500, `Error deleting book with isbn: ${isbn} from library`);
    return output;
  }
};