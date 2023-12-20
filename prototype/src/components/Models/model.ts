export interface ModelProps {
    /**
     * Set color of the model
     */
    readonly interior: string;
    /**
     * Set color of the model
     */
    readonly exterior: string;
    /**
     * To show or hide model
     */
    readonly visible: boolean
}


export const models = ["Lamborghini Aventador J", "Maserati MC20", "Autobianchi Stellina"] as const;
export type Model = typeof models[number];