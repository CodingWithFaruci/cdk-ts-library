/* eslint-disable max-lines */
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import environmentConfig from '../../bin/stack-config';
import * as Stack from '../../lib/cdk-ts-library-stack';

const app = new cdk.App();
const stack = new Stack.CdkTsLibraryStack(app, 'MyTestStack', environmentConfig);
const template = Template.fromStack(stack);

test('VPC Created', () => {
  template.hasResourceProperties('AWS::EC2::VPC', {
    Tags: [{
      Key: 'Name',
      Value: environmentConfig.vpcName,
    }],
  });
});

test('KMS Key with Alias Created', () => {
  template.hasResourceProperties('AWS::KMS::Key', {
    Description: environmentConfig.kms.desc,
  });
  template.hasResourceProperties('AWS::KMS::Alias', {
    AliasName: `alias/${environmentConfig.kms.alias}`,
  });
});

test('RDS Aurora Cluster Created', () => {
  template.hasResourceProperties('AWS::RDS::DBCluster', {
    DatabaseName: environmentConfig.databaseName,
    Engine: 'aurora-postgresql',
    EngineMode: 'serverless',
    DBClusterParameterGroupName: 'default.aurora-postgresql10',
    StorageEncrypted: true,
  });
});

test('Lambda Function Created', () => {
  template.hasResourceProperties('AWS::Lambda::Function', {
    FunctionName: environmentConfig.lambda.name,
    MemorySize: environmentConfig.lambda.memorySize,
    ReservedConcurrentExecutions: environmentConfig.lambda.rcce,
    Runtime: 'nodejs16.x',
    Environment: {
      Variables: {
        DB_NAME: environmentConfig.databaseName,
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      },
    },
  });
});

test('ApiGateway Created', () => {
  template.hasResourceProperties('AWS::ApiGateway::RestApi', {
    Name: environmentConfig.api.name,
    Description: environmentConfig.api.desc,
  });

  template.hasResourceProperties('AWS::ApiGateway::ApiKey', {
    Name: environmentConfig.apiKeyName,
    Enabled: true,
  });

  template.hasResourceProperties('AWS::ApiGateway::UsagePlan', {
    UsagePlanName: environmentConfig.usageplan.name,
    Description: environmentConfig.usageplan.desc,
    Quota: {
      Limit: environmentConfig.usageplan.limit,
      Period: 'MONTH',
    },
    Throttle: {
      BurstLimit: environmentConfig.usageplan.burstLimit,
      RateLimit: environmentConfig.usageplan.rateLimit,
    },
  });

  const requestValidators = [
    { body: true, params: true },
    { body: true, params: false },
    { body: false, params: true },
  ];
  requestValidators.map((validator) => {
    template.hasResourceProperties('AWS::ApiGateway::RequestValidator', {
      ValidateRequestBody: validator.body,
      ValidateRequestParameters: validator.params,
    });
  });

  const noApiKeyRequired = [
    'getBook',
    'getBooks',
  ];
  noApiKeyRequired.map((name) => {
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      OperationName: name,
      HttpMethod: 'GET',
    });
  });

  const apiKeyRequired = [
    { name: 'postBooks', method: 'POST' },
    { name: 'patchBook', method: 'PATCH' },
    { name: 'deleteBook', method: 'DELETE' },
  ];
  apiKeyRequired.map((method) => {
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      OperationName: method.name,
      HttpMethod: method.method,
      ApiKeyRequired: true,
    });
  });
});