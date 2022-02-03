#!/usr/bin/env node
import 'source-map-support/register';
import { App, StageProps } from 'aws-cdk-lib';
import { ProductionStage } from "./prod-stage"

const app = new App();

const stageProps: StageProps = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
};

new ProductionStage(app, "CarViewerProductionStage", stageProps)



