import * as cdk from '@aws-cdk/core';
import { ObjectOwnership, Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source, StorageClass } from '@aws-cdk/aws-s3-deployment';
import { join } from "path";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const carViewerBucket = new Bucket(this, 'CarViewerBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      bucketName: "3d-car-viewer-s3-asset",
      objectOwnership: ObjectOwnership.BUCKET_OWNER_PREFERRED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    new BucketDeployment(this, 'CarViewerWebsite', {
      sources: [Source.asset(join(__dirname, "..", "..", "prototype", "build"))],
      destinationBucket: carViewerBucket,
      storageClass: StorageClass.STANDARD,
    });
    // The code that defines your stack goes here
  }
}
