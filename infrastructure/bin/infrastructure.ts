#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { CarViewerStage } from "./stage"

const app = new App();

new CarViewerStage(app, "CarViewerProd", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1"
  },
})



