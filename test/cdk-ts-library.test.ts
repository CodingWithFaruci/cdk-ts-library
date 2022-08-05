import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import environmentConfig from '../bin/stack-config';
import * as Stack from '../lib/cdk-ts-library-stack';

// example test.
test('SQS Queue Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Stack.CdkTsLibraryStack(app, 'MyTestStack', environmentConfig);
  // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::SQS::Queue', {
    VisibilityTimeout: 300,
    QueueName: 'testName',
  });
});
