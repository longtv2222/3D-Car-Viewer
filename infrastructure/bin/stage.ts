import { Stack, Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { SpaWebsite } from "../lib/constructs/spa-website";
import * as s3deployment from "aws-cdk-lib/aws-s3-deployment"
import * as logs from "aws-cdk-lib/aws-logs"
import { join } from "path";

export class CarViewerStage extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        const frontend = new Stack(this, 'Frontend');

        const spaWebsite = new SpaWebsite(frontend, "SpaWebsite", {
            distributionDomainName: "3d.themagehub.com",
            route53HostedZoneName: "themagehub.com"
        });

        new s3deployment.BucketDeployment(spaWebsite, 'S3Deployment', {
            sources: [s3deployment.Source.asset(join(__dirname, "..", "..", "prototype", "build"))],
            destinationBucket: spaWebsite.siteOriginBucket,
            storageClass: s3deployment.StorageClass.STANDARD,
            logRetention: logs.RetentionDays.ONE_DAY,
            distribution: spaWebsite.spaDistribution,
        });
    }
}