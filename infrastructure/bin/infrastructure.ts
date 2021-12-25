#!/usr/bin/env node
import 'source-map-support/register';
import { StackProps, App } from 'aws-cdk-lib';
import { CarViewerFrontEndStack } from '../lib/car-viewer-frontend-stack';

const app = new App();

const stackProps: StackProps = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
};

new CarViewerFrontEndStack(app, 'CarViewerInfrastructure', stackProps);

