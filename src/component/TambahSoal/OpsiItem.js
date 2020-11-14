import React from 'react'
import { Editor } from '@tinymce/tinymce-react'

export default function OpsiItem(props) {
    return (
        <div className="form-group">
            <label htmlFor={`opsi${props.type}`}>Opsi {props.type}</label>
            <Editor
                initialValue ={props.value}
                apiKey = 'njsvutrsf1m8e3koexowpglc5grb0z21ujbxpll08y9gvt23'
                init = {{
                    menubar: false,
                    min_height:400
                }}
                value={props.value}
                onEditorChange={props.onEditorChange}
            />
        </div>
    )
}
