import * as cdk from '@aws-cdk/core';
import { ObjectOwnership, Bucket, IBucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source, StorageClass } from '@aws-cdk/aws-s3-deployment';
import { join } from "path";

export class InfrastructureStack extends cdk.Stack {

  public carViewerBucket: IBucket;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.carViewerBucket = new Bucket(this, 'CarViewerBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      bucketName: "3d-car-viewer-s3-asset",
      objectOwnership: ObjectOwnership.BUCKET_OWNER_PREFERRED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    new BucketDeployment(this, 'CarViewerWebsite', {
      sources: [Source.asset(join(__dirname, "..", "..", "prototype", "build"))],
      destinationBucket: this.carViewerBucket,
      storageClass: StorageClass.STANDARD,
    });
  }
}
