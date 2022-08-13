import {
  RDSDataClient,
  ExecuteStatementCommand,
  ExecuteStatementCommandInput,
} from '@aws-sdk/client-rds-data';

export const createRdsClient = async ():Promise<RDSDataClient> => {
  const client = new RDSDataClient({ region: 'eu-west-1' });
  return client;
};

// creates command for rds client, not using parameters because arrays are not supported yet.
export const createRdsCommand = (query:string):ExecuteStatementCommand => {
  const execute : ExecuteStatementCommandInput = {
    resourceArn: process.env.CLUSTER_ARN,
    secretArn: process.env.SECRET_ARN,
    database: process.env.DB_NAME,
    sql: query,
    parameters: [],
    formatRecordsAs: 'JSON',
  };

  const command = new ExecuteStatementCommand(execute);
  return command;
};