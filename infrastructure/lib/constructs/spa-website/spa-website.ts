import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cf from "aws-cdk-lib/aws-cloudfront";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import * as route53 from "aws-cdk-lib/aws-route53";
import { S3BucketOrigin, S3StaticWebsiteOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";

export interface ISpaWebsite {
    /**
     * Bucket that contains the content of your website
     */
    readonly siteOriginBucket: s3.IBucket;
    /** 
     * Implement security best practices for header policy
     */
    readonly spaDistribution: cf.IDistribution;
    /**
     * Certificate assigned to site distribution
     */
    readonly siteCertificate: acm.ICertificate;
    /**
     * WWW domain name for website
     * @example www.example.com
     */
    readonly wwwDomainName: string;
    /**
     * Domain name for website
     * @example example.com
     */
    readonly domainName: string;
}

export interface SpaWebsiteProps {
    /**
     * Domain Name for SPA Distrbution
     */
    readonly distributionDomainName: string,
    /**
     * Route 53 hosted zone name you want to add DNS records to
     */
    readonly route53HostedZoneName: string,
}

export class SpaWebsite extends Construct implements ISpaWebsite {
    /** 
    * Implement security best practices for header policy
    */
    static defaultResponseHeadersPolicy: cf.ResponseSecurityHeadersBehavior = {
        frameOptions: {
            frameOption: cf.HeadersFrameOption.DENY,
            override: true,
        },
        referrerPolicy: {
            referrerPolicy: cf.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
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
            contentSecurityPolicy: "default-src 'self' file: data: blob: filesystem:; img-src 'self' file: data: blob: filesystem:; script-src 'self' 'unsafe-eval'; style-src 'unsafe-inline' 'self'; object-src 'none'",
            override: true,
        },
        contentTypeOptions: {
            override: true,
        }
    };

    readonly siteOriginBucket: s3.IBucket;

    readonly spaDistribution: cf.IDistribution;

    readonly siteCertificate: acm.ICertificate;

    readonly wwwDomainName: string;

    readonly domainName: string;

    constructor(scope: Construct, id: string, props: SpaWebsiteProps) {
        super(scope, id);

        this.domainName = props.distributionDomainName;
        this.wwwDomainName = `www.${props.distributionDomainName}`;

        this.siteOriginBucket = new s3.Bucket(this, 'OriginBucket', {
            publicReadAccess: false,
            objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            enforceSSL: true,
        });

        /**
         * Certificate
         */
        const zone = route53.HostedZone.fromLookup(this, "HostedZone", {
            domainName: props.route53HostedZoneName,
        });

        this.siteCertificate = new acm.Certificate(this, "SpaCertificate", {
            domainName: this.domainName,
            subjectAlternativeNames: [this.wwwDomainName],
            validation: acm.CertificateValidation.fromDns(zone),
        });

        const enableIpv6 = true;

        this.spaDistribution = new cf.Distribution(this, 'SpaDistribution', {
            defaultBehavior: {
                origin: S3BucketOrigin.withOriginAccessControl(this.siteOriginBucket),
                allowedMethods: cf.AllowedMethods.ALLOW_GET_HEAD,
                responseHeadersPolicy: new cf.ResponseHeadersPolicy(this, "ResponseHeader", {
                    securityHeadersBehavior: SpaWebsite.defaultResponseHeadersPolicy,
                }),
                smoothStreaming: false,
                cachePolicy: cf.CachePolicy.CACHING_OPTIMIZED,
                viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                originRequestPolicy: cf.OriginRequestPolicy.CORS_S3_ORIGIN,
                compress: true,
                cachedMethods: cf.CachedMethods.CACHE_GET_HEAD,
            },
            domainNames: [this.domainName],
            certificate: this.siteCertificate,
            priceClass: cf.PriceClass.PRICE_CLASS_100, //Distrubute to USA, Canada, Europe, & Israel only
            defaultRootObject: "index.html",
            minimumProtocolVersion: cf.SecurityPolicyProtocol.TLS_V1_2_2021,
            enableIpv6: enableIpv6,
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
            comment: `3D Car Viewer Distribution`
        });

        /**
         * For handling redirect to apex domain name
         */
        const redirectBucket = new s3.Bucket(this, "RedirectBucket", {
            websiteRedirect: {
                hostName: this.domainName,
                protocol: s3.RedirectProtocol.HTTPS
            },
            objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
            removalPolicy: RemovalPolicy.DESTROY,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            enforceSSL: true,
        });

        const redirectDistribution = new cf.Distribution(this, "RedirectDistribution", {
            defaultBehavior: {
                origin: new S3StaticWebsiteOrigin(redirectBucket),
                viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                originRequestPolicy: cf.OriginRequestPolicy.CORS_S3_ORIGIN,
            },
            domainNames: [this.wwwDomainName], // domain name for this distribution must be www domain name
            certificate: this.siteCertificate,
            priceClass: cf.PriceClass.PRICE_CLASS_100,
            enableIpv6: enableIpv6,
            comment: "For handling redirection to apex domain name of 3d.themagehub.com",
        });

        /**
         * Populate record for domain with its distribution
         */
        [{
            domain: this.domainName,
            distribution: this.spaDistribution
        }, {
            domain: this.wwwDomainName,
            distribution: redirectDistribution
        }].forEach(i => {
            // Adding DNS Records for Distribution
            new route53.ARecord(this, `${i.domain}ARecord`, {
                zone,
                target: route53.RecordTarget.fromAlias(new CloudFrontTarget(i.distribution)),
                comment: "Created by SpaWebsite Construct - AWS CDK",
                recordName: i.domain,
            });

            // For IPV6
            if (enableIpv6)
                new route53.AaaaRecord(this, `${i.domain}AaaaRecord`, {
                    zone,
                    target: route53.RecordTarget.fromAlias(new CloudFrontTarget(i.distribution)),
                    comment: "Created by SpaWebsite Construct - AWS CDK",
                    recordName: i.domain,
                });
        });
    }

}