#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkTsLibraryStack } from '../lib/cdk-ts-library-stack';

// importing configuration based on environment
import environmentConfig from './stack-config';

const app = new cdk.App();

// injecting configurations into stack based on environment.
new CdkTsLibraryStack(app, 'cdk-ts-library', environmentConfig);