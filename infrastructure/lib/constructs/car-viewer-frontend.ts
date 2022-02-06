import { BucketDeployment, Source, StorageClass } from 'aws-cdk-lib/aws-s3-deployment';
import { join } from "path";
import { Construct } from 'constructs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { CloudFrontS3SpaPatternConstruct } from './cloudfront-s3-spa-pattern';
import { CarViewerDnsConstruct, CarViewerDnsConstructProps } from './car-viewer-dns';

export interface CarViewerFrontEndConstructProps {
  dnsProps: CarViewerDnsConstructProps
}

export class CarViewerFrontEndConstruct extends Construct {

  constructor(scope: Construct, id: string, props: CarViewerFrontEndConstructProps) {
    super(scope, id);

    const carViewerDns = new CarViewerDnsConstruct(this, 'CarViewerDns', props.dnsProps);

    const carViewerSpaPattern = new CloudFrontS3SpaPatternConstruct(this, 'CarViewerSpaPattern', {
      dnsProps: carViewerDns
    });

    new BucketDeployment(this, 'CarViewerWebsite', {
      sources: [Source.asset(join(__dirname, "..", "..", "..", "prototype", "build"))],
      destinationBucket: carViewerSpaPattern.spaOriginBucket,
      storageClass: StorageClass.STANDARD,
      logRetention: RetentionDays.ONE_DAY,
      distribution: carViewerSpaPattern.spaDistribution,
    });

  }
}
