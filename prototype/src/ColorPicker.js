import { state } from './App.js'
import { useState } from 'react'
import { TwitterPicker } from 'react-color'

export default function ColorPicker() {
    const [visibility1, setVisibility] = useState(false);
    const [visibility2, setVisibility2] = useState(false);
    return (
        <div className="picker">
            <button className="button" onClick={() => setVisibility(!visibility1)}>
                <br />Interior
          <TwitterPicker className={visibility1 ? "padding" : "padding-hidden"} width={400} onChange={(color) => { state.items.interior = color.hex }} />
            </button>

            <button className="button" onClick={() => setVisibility2(!visibility2)}>
                <br />
          Exterior
           <TwitterPicker className={visibility2 ? "padding" : "padding-hidden"} width={400} onChange={(color) => { state.items.exterior = color.hex }} />
            </button>
        </div>
    )
}