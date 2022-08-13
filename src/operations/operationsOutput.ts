import { IOperationOutput } from '../types';

export const operationsOutput = (code: number, body: string):IOperationOutput => {
  const result = {
    statusCode: code,
    output: { message: body },
  };
  return result;
};