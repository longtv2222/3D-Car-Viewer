import { Stack, Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CarViewerDnsConstructProps } from "../lib/constructs/car-viewer-dns";
import { CarViewerFrontEndConstruct } from "../lib/constructs/car-viewer-frontend";

export interface Props extends StageProps {
    dnsProps: CarViewerDnsConstructProps
}

export class CarViewerFrontEndStage extends Stage {
    constructor(scope: Construct, id: string, stageProps: Props) {
        super(scope, id, stageProps);

        const frontendStack = new Stack(this, '3DCarViewerFrontEndStack', {
            env: stageProps.env,
        });

        new CarViewerFrontEndConstruct(frontendStack, "CarViewerFrontEnd", {
            dnsProps: stageProps.dnsProps,
        });
    }
}