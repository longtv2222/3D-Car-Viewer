import { Stack, StackProps } from 'aws-cdk-lib';
import { BucketDeployment, Source, StorageClass } from 'aws-cdk-lib/aws-s3-deployment';
import { join } from "path";
import { Construct } from 'constructs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { CloudFrontS3SpaPatternConstruct } from './cloudfront-s3-spa-pattern';

export class CarViewerFrontEndConstruct extends Construct {

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const carViewerSpaPattern = new CloudFrontS3SpaPatternConstruct(this, 'CarViewerSpaPattern');

    new BucketDeployment(this, 'CarViewerWebsite', {
      sources: [Source.asset(join(__dirname, "..", "..", "..", "prototype", "build"))],
      destinationBucket: carViewerSpaPattern.spaOriginBucket,
      storageClass: StorageClass.STANDARD,
      logRetention: RetentionDays.ONE_DAY,
      distribution: carViewerSpaPattern.spaDistribution,
    });

  }
}
