#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { CarViewerFrontEndStage } from "./prod-stage"

const app = new App();

new CarViewerFrontEndStage(app, "CarViewerProductionStage", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
  dnsProps: {
    domainName: "3d.themagehub.com",
    zoneName: "themagehub.com",
  },
})



