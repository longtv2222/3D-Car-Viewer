import { Stack, StackProps, Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CarViewerFrontEndConstruct } from "../constructs/car-viewer-frontend"

export class CarViewerFrontEndStack extends Stack {
    constructor(scope: Construct, id: string, stackProps?: StackProps) {
        super(scope, id, stackProps);

        new CarViewerFrontEndConstruct(this, "CarViewerProductionFrontEnd");
    }
}