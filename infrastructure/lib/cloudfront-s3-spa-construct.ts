import { IBucket, BucketPolicy, ObjectOwnership, Bucket, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from "constructs"
import { ResponseHeadersPolicy, SecurityPolicyProtocol } from 'aws-cdk-lib/aws-cloudfront';


/**
 * Documentation on how to setup origin access identity access to S3:
 * - https://aws.amazon.com/premiumsupport/knowledge-center/s3-website-cloudfront-error-403/
 * - https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
 */
export class CloudFrontS3SpaConstruct extends Construct {
    /** 
 * Implement security best practices for header policy
 */
    static defaultResponseHeadersPolicy: cloudfront.ResponseSecurityHeadersBehavior = {
        frameOptions: {
            frameOption: cloudfront.HeadersFrameOption.DENY,
            override: true,
        },
        referrerPolicy: {
            referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
            override: true,
        },
        strictTransportSecurity: {
            accessControlMaxAge: Duration.seconds(31536000),
            includeSubdomains: true,
            preload: true,
            override: true,
        },
        xssProtection: {
            protection: true,
            modeBlock: true,
            override: true,
        },
        contentSecurityPolicy: {
            contentSecurityPolicy: "default-src 'none'; img-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'",
            override: true,
        },
        contentTypeOptions: {
            override: true,
        }
    };

    constructor(scope: Construct, id: string) {
        super(scope, id);

        const spaOriginBucket = new Bucket(this, 'SpaOriginBucket', {
            publicReadAccess: false,
            objectOwnership: ObjectOwnership.BUCKET_OWNER_PREFERRED,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            enforceSSL: true,
        });

        const s3OriginTarget = new origins.S3Origin(spaOriginBucket);

        const spaResponseHeader = new ResponseHeadersPolicy(this, 'SpaResponseHeaderPolicy', {
            securityHeadersBehavior: CloudFrontS3SpaConstruct.defaultResponseHeadersPolicy,
        });

        new cloudfront.Distribution(this, 'SpaDistribution', {
            defaultBehavior: {
                origin: s3OriginTarget,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
                responseHeadersPolicy: spaResponseHeader,
                smoothStreaming: false,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
                compress: true,
                cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
            },
            priceClass: cloudfront.PriceClass.PRICE_CLASS_100, //Distrubute to USA, Canada, Europe, & Israel only
            defaultRootObject: "index.html",
            minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
            errorResponses: [
                {
                    httpStatus: 403,
                    responseHttpStatus: 200,
                    responsePagePath: "/index.html",
                },
                {
                    httpStatus: 403,
                    responseHttpStatus: 200,
                    responsePagePath: "/index.html",
                }
            ],
        });
        
    }
}
