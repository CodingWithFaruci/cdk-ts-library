import { ExecuteStatementCommand, RDSDataClient } from '@aws-sdk/client-rds-data';
import { createRdsCommand } from '../client';
import { IOperationOutput, IPatch } from '../types';
import { operationsOutput } from './operationsOutput';
import { patchBookQuery } from './queries';

export const patchBook = async (isbn: string, event: string, client: RDSDataClient): Promise<IOperationOutput> => {
  try {
    const patch: IPatch = JSON.parse(event);
    const query: string = patchBookQuery(isbn, patch);

    const command: ExecuteStatementCommand = createRdsCommand(query);
    await Promise.resolve(client.send(command));
    const output: IOperationOutput = operationsOutput(200, `Updated book with isbn: ${isbn} in library`);
    return output;

  } catch (error) {
    if (process.env.DEBUG == 'true') {
      console.log('Error patching book: ', error);
    }
    const output: IOperationOutput = operationsOutput(500, 'Error occured when updating library');
    return output;
  }
};