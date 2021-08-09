#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import { CloudFrontStack } from '../lib/cloudfront-stack';
import { ConcreteDependable, StackProps } from '@aws-cdk/core';

const app = new cdk.App();

const stackProps: StackProps = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
};

const s3WebsiteStack = new InfrastructureStack(app, 'InfrastructureStack', stackProps);

const cloudfrontStack = new CloudFrontStack(app, 'CloudFrontStack', {
  s3Website: s3WebsiteStack.carViewerBucket,
  stackProps: stackProps
});

cloudfrontStack.addDependency(s3WebsiteStack);
