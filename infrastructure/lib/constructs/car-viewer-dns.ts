import { Duration, Stack } from "aws-cdk-lib";
import { CertificateValidation, DnsValidatedCertificate, ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { IDistribution } from "aws-cdk-lib/aws-cloudfront";
import { AaaaRecord, ARecord, CnameRecord, HostedZone, HostedZoneAttributes, IHostedZone } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Construct } from "constructs";

export interface CarViewerDnsConstructProps {
    zoneName: string,
    domainName: string,
}

export interface ICarViewerDnsConstruct {
    certificate: ICertificate;
    domainName: string;
}

export class CarViewerDnsConstruct extends Construct implements ICarViewerDnsConstruct {
    readonly certificate: ICertificate;
    readonly hostedZone: IHostedZone;
    readonly domainName: string;

    constructor(scope: Construct, id: string, props: CarViewerDnsConstructProps) {
        super(scope, id);

        this.domainName = props.domainName;

        if (this.domainName.startsWith("www"))
            throw new Error("Domain name cannot start with wwww");

        const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
            domainName: props.zoneName,
            privateZone: false,
        });
        this.hostedZone = hostedZone;

        this.certificate = new DnsValidatedCertificate(this, "Certificate", {
            validation: CertificateValidation.fromDns(hostedZone),
            domainName: props.domainName,
            hostedZone,
            region: "us-east-1",
        });

    }

    addDistributionRecordsToHostedZone = (distribution: IDistribution, Ipv6Enabled?: boolean) => {
        const A_RECORD_GLOBAL_UNIQUE_ID = `${distribution.node.id}ARecord`;

        const AAAA_RECORD_GLOBAL_UNIQUE_ID = `${distribution.node.id}AaaaRecord`;

        const config = {
            zone: this.hostedZone,
            target: {
                aliasTarget: new CloudFrontTarget(distribution),
            },
            recordName: this.domainName,
            ttl: Duration.minutes(30),
        };

        const stack = Stack.of(this);
        stack.node.tryFindChild(A_RECORD_GLOBAL_UNIQUE_ID) as ARecord ?? new ARecord(this, A_RECORD_GLOBAL_UNIQUE_ID, config);

        if (Ipv6Enabled)
            stack.node.tryFindChild(A_RECORD_GLOBAL_UNIQUE_ID) as AaaaRecord ??
                new AaaaRecord(this, AAAA_RECORD_GLOBAL_UNIQUE_ID, config);
    }

}