import { IBucket, ObjectOwnership, Bucket, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from "constructs"
import { IDistribution, ResponseHeadersPolicy, SecurityPolicyProtocol } from 'aws-cdk-lib/aws-cloudfront';
import { ICarViewerDnsConstruct } from './car-viewer-dns';
import { join } from 'path';

export interface ICloudFrontS3SpaPatternConstruct {
    readonly spaOriginBucket: IBucket;
    readonly spaDistribution: IDistribution;
}

export interface CloudFrontS3SpaPatternConstructProps {
    dnsProps: ICarViewerDnsConstruct;
}
/**
 * Documentation on how to setup origin access identity access to S3:
 * - https://aws.amazon.com/premiumsupport/knowledge-center/s3-website-cloudfront-error-403/
 * - https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
 */
export class CloudFrontS3SpaPatternConstruct extends Construct implements ICloudFrontS3SpaPatternConstruct {

    /**
     * Bucket that contains the content of your SPA
     */
    readonly spaOriginBucket: IBucket;

    /**
     * CloudFront Distribution (CDN) for your SPA
     */
    readonly spaDistribution: cloudfront.IDistribution;

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
            contentSecurityPolicy: "default-src 'self' file: data: blob: filesystem:; img-src 'self' file: data: blob: filesystem:; script-src 'self' 'unsafe-eval'; style-src 'self'; object-src 'none'",
            override: true,
        },
        contentTypeOptions: {
            override: true,
        }
    };

    constructor(scope: Construct, id: string, props: CloudFrontS3SpaPatternConstructProps) {
        super(scope, id);

        const spaOriginBucket = new Bucket(this, 'SpaOriginBucket', {
            publicReadAccess: false,
            objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            enforceSSL: true,
        });
        this.spaOriginBucket = spaOriginBucket;

        const s3OriginTarget = new origins.S3Origin(spaOriginBucket);

        const spaResponseHeader = new ResponseHeadersPolicy(this, 'SpaResponseHeaderPolicy', {
            securityHeadersBehavior: CloudFrontS3SpaPatternConstruct.defaultResponseHeadersPolicy,
        });

        const Ipv6Enabled = true;

        const viewerRequestFunction = new cloudfront.Function(this, "SpaViewerRequestFunction", {
            code: cloudfront.FunctionCode.fromFile({
                filePath: join(__dirname, "viewer-request-redirect.ts")
            }),
            comment: "A Function to redirect from WWW to non WWW in Viewer Request",
        });

        const spaDistribution = new cloudfront.Distribution(this, 'SpaDistribution', {
            defaultBehavior: {
                origin: s3OriginTarget,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
                responseHeadersPolicy: spaResponseHeader,
                smoothStreaming: false,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
                compress: true,
                functionAssociations: [{
                    eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
                    function: viewerRequestFunction,
                }],
                cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
            },
            domainNames: [props.dnsProps.domainName, props.dnsProps.wwwDomainName],
            certificate: props.dnsProps.cloudfrontCertificate,
            priceClass: cloudfront.PriceClass.PRICE_CLASS_100, //Distrubute to USA, Canada, Europe, & Israel only
            defaultRootObject: "index.html",
            minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
            enableIpv6: Ipv6Enabled,
            // In case if user requests non-existing path so that we can redirect to appropriate page
            errorResponses: [
                {
                    httpStatus: 403,
                    responseHttpStatus: 200,
                    responsePagePath: "/index.html",
                },
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: "/index.html",
                }
            ],
            comment: `Spa Distribution for ${id}`
        });
        this.spaDistribution = spaDistribution;

        props.dnsProps.addDistributionRecordsToHostedZone(this.spaDistribution, Ipv6Enabled);
    }

}
