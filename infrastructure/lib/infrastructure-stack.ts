import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { ObjectOwnership, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source, StorageClass } from 'aws-cdk-lib/aws-s3-deployment';
import { join } from "path";
import { Construct } from 'constructs';

export class InfrastructureStack extends Stack {


  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const carViewerBucket = new Bucket(this, 'CarViewerBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      bucketName: "3d-car-viewer-s3-asset",
      objectOwnership: ObjectOwnership.BUCKET_OWNER_PREFERRED,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    new BucketDeployment(this, 'CarViewerWebsite', {
      sources: [Source.asset(join(__dirname, "..", "..", "prototype", "build"))],
      destinationBucket: carViewerBucket,
      storageClass: StorageClass.STANDARD,
    });

    // new CloudFrontS3Construct(this, 'CloudFrontS3', { s3Website: carViewerBucket })
  }
}
