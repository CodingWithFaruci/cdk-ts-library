import { ExecuteStatementCommand, ExecuteStatementCommandOutput, RDSDataClient } from '@aws-sdk/client-rds-data';
import { createRdsCommand } from '../client';
import { IBook, IOperationOutput, IPost } from '../types';
import { operationsOutput } from './operationsOutput';
import { postBookQuery } from './queries';

export const postBooks = async (event: string, client: RDSDataClient): Promise<IOperationOutput> => {
  try {
    const postPromises: Promise<any>[] = [];
    let booksAdded: number = 0;

    const parsed: IPost = JSON.parse(event);
    const { books } = parsed;

    books.map((book: IBook) => {
      const query: string = postBookQuery(book);
      const command: ExecuteStatementCommand = createRdsCommand(query);
      const postPromise: Promise<ExecuteStatementCommandOutput> = Promise.resolve(client.send(command));
      postPromises.push(postPromise);
      booksAdded += 1;
      return;
    });

    await Promise.all(postPromises);
    const output: IOperationOutput = operationsOutput(200, `Added ${booksAdded} book(s) to library`);
    return output;

  } catch (error) {
    if (process.env.DEBUG == 'true') {
      console.log('Error posting books: ', error);
    }
    const output: IOperationOutput = operationsOutput(500, 'Error adding book(s) to library');
    return output;
  }
};