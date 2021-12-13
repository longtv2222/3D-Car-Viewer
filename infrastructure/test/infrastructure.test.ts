import * as cdk from 'aws-cdk-lib';
import * as Infrastructure from '../lib/infrastructure-stack';

test('Stack Test', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Infrastructure.InfrastructureStack(app, 'MyTestStack');
    // THEN
    //Tests will be added later
});
