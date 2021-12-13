#!/usr/bin/env node
import 'source-map-support/register';
import { StackProps, App } from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';

const app = new App();

const stackProps: StackProps = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
};

const s3WebsiteStack = new InfrastructureStack(app, 'InfrastructureStack', stackProps);

