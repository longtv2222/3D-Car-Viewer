import * as cdk from 'aws-cdk-lib';
import { Stack } from 'aws-cdk-lib';
import { SpaWebsite } from "../";

test('Stack Test', () => {
    const app = new cdk.App();

    const stack = new Stack(app, "Stack", {
        env: {
            account: "123456789",
            region: "us-east-1"
        }
    });

    expect(() => new SpaWebsite(stack, "Test", {
        distributionDomainName: "example.com",
        route53HostedZoneName: "example.com"
    })).not.toThrowError();

});