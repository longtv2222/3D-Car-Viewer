import { IBucket, BucketPolicy } from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from "constructs"

interface CloudFrontConstructProps {
    s3Website: IBucket;
}

/**
 * Documentation on how to setup origin access identity access to S3:
 * - https://aws.amazon.com/premiumsupport/knowledge-center/s3-website-cloudfront-error-403/
 * - https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
 */
export class CloudFrontS3Construct extends Construct {
    constructor(scope: Construct, id: string, props: CloudFrontConstructProps) {
        super(scope, id);
        const cloudfrontUser = new cloudfront.OriginAccessIdentity(this, 'S3OriginAccessIdentity', { comment: 'Restricting S3 Bucket to this user only' });

        const s3OriginTarget = new origins.S3Origin(props.s3Website, { originAccessIdentity: cloudfrontUser });

        new cloudfront.Distribution(this, 'CarViewerDist', {
            defaultBehavior: { origin: s3OriginTarget, },
            priceClass: cloudfront.PriceClass.PRICE_CLASS_100, //Distrubute to USA, Canada, Europe, & Israel only
        });

        const bucketPolicy = new BucketPolicy(this, 'WebsiteBucketPolicy', {
            bucket: props.s3Website,
            removalPolicy: RemovalPolicy.DESTROY,

        });

        bucketPolicy.document.addStatements(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ["s3:GetObject"],
            principals: [cloudfrontUser.grantPrincipal]
        }));
    }
}
