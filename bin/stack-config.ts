import { ICdkTsLibraryStackProps } from './stack-environment-types';

const environmentConfig: ICdkTsLibraryStackProps = {
  tags: {
    Developer: 'Faruk Ada',
    Application: 'CdkTsLibrary',
  },
  vpcName: 'libraryVpc',
  databaseName:'libraryDB',
  apiKeyName:'libraryApiKey',
  kms: {
    alias: 'libraryKey',
    desc: 'KMS encryption key used for the library database',
  },
  lambda: {
    name: 'libraryResolver',
    desc: 'Function for resolving requests received from the library api',
    memorySize: 512,
    rcce: 50,
    timeout: 30,
    debug: 'true',
  },
  api: {
    name: 'libraryApi',
    desc: 'API for receiving requests for the library database',
  },
  usageplan: {
    name: 'libraryUsageplan',
    desc: 'Usageplan for the library api key',
    limit: 1000, //per month
    rateLimit: 10,
    burstLimit: 2,
  },
};

export default environmentConfig;