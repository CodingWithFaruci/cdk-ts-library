import { StackProps } from 'aws-cdk-lib';

export interface ICdkTsLibraryStackProps extends StackProps {
  vpcName:string,
  databaseName:string,
  apiKeyName:string,
  kms: {
    alias: string,
    desc: string,
  },
  lambda: {
    name: string,
    desc: string,
    memorySize: number,
    rcce: number,
    timeout: number,
    debug: 'false' | 'true'
  },
  api: {
    name: string,
    desc: string
  },
  usageplan: {
    name: string,
    desc: string,
    limit: number,
    rateLimit: number,
    burstLimit: number
  }
}