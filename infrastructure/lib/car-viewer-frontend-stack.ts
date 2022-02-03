import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { ObjectOwnership, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source, StorageClass } from 'aws-cdk-lib/aws-s3-deployment';
import { join } from "path";
import { Construct } from 'constructs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { CloudFrontS3SpaPatternConstruct } from './cloudfront-s3-spa-construct';

export class CarViewerFrontEndStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const carViewerSpaPattern = new CloudFrontS3SpaPatternConstruct(this, 'CarViewerSpaPattern');

    new BucketDeployment(this, 'CarViewerWebsite', {
      sources: [Source.asset(join(__dirname, "..", "..", "prototype", "build"))],
      destinationBucket: carViewerSpaPattern.spaOriginBucket,
      storageClass: StorageClass.STANDARD,
      logRetention: RetentionDays.ONE_DAY,
    });

  }
}
