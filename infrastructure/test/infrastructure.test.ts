import * as cdk from 'aws-cdk-lib';
import * as Infrastructure from '../lib/car-viewer-frontend-stack';

test('Stack Test', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Infrastructure.CarViewerFrontEndStack(app, 'MyTestStack');
    // THEN
    //Tests will be added later
});
