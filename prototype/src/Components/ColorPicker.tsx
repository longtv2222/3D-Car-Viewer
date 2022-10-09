import { useState } from 'react'
import { TwitterPicker } from 'react-color'
import { state } from '../App'

/**
 * For switching color of car 
 */

type ColorPickerProps = {
    passedFunction: React.MouseEventHandler<HTMLButtonElement>,
    enableRotate: React.MouseEventHandler<HTMLButtonElement>,
}
export default function ColorPicker(props: ColorPickerProps) {
    const [visibility1, setVisibility] = useState(false);
    const [visibility2, setVisibility2] = useState(false);
    const interiorColors = ['#000000', '#EECCAA', '#808080', '#962'];
    const exteriorColors = ['#000000', '#808080', '#010180', '#800101', '#0000EE'];


    return (
        <div className="picker">
            <button className="button" onClick={() => setVisibility(!visibility1)}>
                <br />Interior
                {/*// @ts-ignore */}
                <TwitterPicker colors={interiorColors} className={visibility1 ? "padding" : "padding-hidden"} width={400} onChange={(color: any) => { state.items.interior = color.hex }} />
            </button>

            <button className="button" onClick={() => setVisibility2(!visibility2)}>
                <br />
                Exterior
                {/*// @ts-ignore */}
                <TwitterPicker colors={exteriorColors} className={visibility2 ? "padding" : "padding-hidden"} width={400} onChange={(color: any) => { state.items.exterior = color.hex }} />
            </button>
            <button className={"button"} onClick={props.passedFunction} >Switch</button>
            <button className={"button"} type="button" onClick={props.enableRotate}>Rotation</button>
        </div>
    )
}
