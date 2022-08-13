/* eslint-disable max-statements */
/* eslint-disable max-lines */
import { Duration, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

// request body validation models
import { createPostModel } from './models/postModel';
import { createPatchModel } from './models/patchModel';

// extended stack environment props
import { ICdkTsLibraryStackProps } from '../bin/stack-environment-types';

export class CdkTsLibraryStack extends Stack {
  constructor(scope: Construct, id: string, props: ICdkTsLibraryStackProps) {
    super(scope, id, props);

    /** @vpc virtual private cloud to deploy rds cluster in */
    const vpc: ec2.Vpc = new ec2.Vpc(this, 'ClusterVpc', { vpcName: props.vpcName });

    /** @key kms key for data encryption in rds cluster */
    const key: kms.Key = new kms.Key(this, 'EncryptionKey', { alias: props.kms.alias, description: props.kms.desc });

    /** @cluster rds aurora serverless cluster */
    const cluster: rds.ServerlessCluster = new rds.ServerlessCluster(this, 'AuroraCluster', {
      defaultDatabaseName: props.databaseName,
      vpc,
      storageEncryptionKey: key,
      engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
      parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-postgresql10'),
      scaling: {
        minCapacity: 1,
        maxCapacity: 1,
      },
    });

    /** @resolver lambda function for resolving api requests */
    const resolver: lambda.Function = new lambda.Function(this, 'ResolverFunction', {
      functionName: props.lambda.name,
      description: props.lambda.desc,
      handler: 'index.handler',
      code: new lambda.AssetCode('dist'),
      runtime: lambda.Runtime.NODEJS_16_X,
      memorySize: props.lambda.memorySize,
      logRetention: RetentionDays.THREE_DAYS,
      reservedConcurrentExecutions: props.lambda.rcce,
      timeout: Duration.seconds(props.lambda.timeout),
      environment: {
        CLUSTER_ARN: cluster.clusterArn,
        SECRET_ARN: cluster.secret?.secretArn || '',
        DB_NAME: props.databaseName,
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        DEBUG: props.lambda.debug,
      },
    });

    // wait for cluster to be created before creating lambda function
    resolver.node.addDependency(cluster);

    // grant lambda function permissions on kms ket and rds cluster
    key.grantEncryptDecrypt(resolver);
    cluster.grantDataApiAccess(resolver);

    // add permissions to lambda function to allow apigateway to invoke it
    resolver.addPermission('ApiGatewayInvokePermissions', { principal: new iam.ServicePrincipal('apigateway.amazonaws.com') });

    /** @integration apigateway lambda integration for resolving api requests */
    const integration: apigateway.LambdaIntegration = new apigateway.LambdaIntegration(resolver);

    /** @api apigateway endpoint for receiving requests */
    const api: apigateway.RestApi = new apigateway.RestApi( this, 'ApiGateway', {
      restApiName: props.api.name,
      description: props.api.desc,
      apiKeySourceType: apigateway.ApiKeySourceType.HEADER,
      policy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: ['execute-api:Invoke'],
            principals: [new iam.AnyPrincipal()],
            resources: ['*'],
            effect: iam.Effect.ALLOW,
          }),
        ],
      }),
    });

    // add an api key to the api
    const apiKey: apigateway.IApiKey = api.addApiKey('ApiKey', { apiKeyName: props.apiKeyName });

    /**
     * @bodyValidator validates api request on containing body
     * @paramValidator validates api request on containing params
     * @bodyAndParamValidator validates api request on containing body and params
     */
    const bodyValidator: apigateway.RequestValidator = new apigateway.RequestValidator(this, 'BodyValidator', {
      requestValidatorName: 'bodyValidator',
      validateRequestParameters: false,
      validateRequestBody: true,
      restApi: api,
    });
    const paramValidator: apigateway.RequestValidator = new apigateway.RequestValidator(this, 'ParamValidator', {
      requestValidatorName: 'paramValidator',
      validateRequestParameters: true,
      validateRequestBody: false,
      restApi: api,
    });
    const bodyAndParamValidator: apigateway.RequestValidator = new apigateway.RequestValidator(this, 'BodyAndParamValidator', {
      requestValidatorName: 'bodyAndParamValidator',
      validateRequestParameters: true,
      validateRequestBody: true,
      restApi: api,
    });

    /**
     * @postModel post api request body validation model
     * @patchModel patch api request body validation model
     * @filterModel filtered api request body validation model
     */
    const postModel: apigateway.Model = createPostModel(this, api);
    const patchModel: apigateway.Model = createPatchModel(this, api);

    /** @rootResource apigateway root resource */
    const rootResource: apigateway.Resource = api.root.addResource('v1');

    /**
     * @book apigateway resource for book
     * @isbn apigateway resource path for isbn
     */
    const book: apigateway.Resource = rootResource.addResource('book');
    const isbn: apigateway.Resource = book.addResource('{isbn}');

    // adding methods GET, PATCH and DELETE to book resource
    isbn.addMethod('GET', integration, {
      operationName: 'getBook',
      apiKeyRequired: false,
      requestValidator: paramValidator,
      requestParameters: { 'method.request.path.isbn': true } });
    isbn.addMethod('PATCH', integration, {
      operationName: 'patchBook',
      apiKeyRequired: true,
      requestValidator: bodyAndParamValidator,
      requestParameters: { 'method.request.path.isbn': true },
      requestModels: { 'application/json': patchModel } });
    isbn.addMethod('DELETE', integration, {
      operationName: 'deleteBook',
      apiKeyRequired: true,
      requestValidator: paramValidator,
      requestParameters: { 'method.request.path.isbn': true } });

    /**
     * @books apigateway resource for books
     * @booksOffset apigateway resource path for books offset
     */
    const books = rootResource.addResource('books');
    const booksOffset = books.addResource('{offset}');

    // adding methods GET and POST to books resource
    books.addMethod('POST', integration, {
      operationName: 'postBooks',
      apiKeyRequired: true,
      requestValidator: bodyValidator,
      requestModels: { 'application/json': postModel } });
    booksOffset.addMethod('GET', integration, {
      operationName: 'getBooks',
      apiKeyRequired: false,
      requestValidator: paramValidator,
      requestParameters: { 'method.request.path.offset': true } });

    /** @plan apigateway usage plan for adding api key to api */
    const plan: apigateway.UsagePlan = api.addUsagePlan('UsagePlan', {
      name: props.usageplan.name,
      description: props.usageplan.desc,
      quota: {
        limit: props.usageplan.limit,
        period: apigateway.Period.MONTH,
      },
      throttle: {
        rateLimit: props.usageplan.rateLimit,
        burstLimit: props.usageplan.burstLimit,
      },
    });

    // add api and api key to useplan
    plan.addApiKey(apiKey);
    plan.addApiStage({
      api: api,
      stage: api.deploymentStage,
    });
  }
}
