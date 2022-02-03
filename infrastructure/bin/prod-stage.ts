import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CarViewerFrontEndStack } from "../lib/stacks/car-viewer-frontend-stack";

export class ProductionStage extends Stage {
    constructor(scope: Construct, id: string, stageProps: StageProps) {
        super(scope, id, stageProps);

        new CarViewerFrontEndStack(this, '3DCarViewerFrontEndStack', {
            env: stageProps.env,
        });

    }
}