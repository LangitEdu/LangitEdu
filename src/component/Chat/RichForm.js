import React from 'react'
import { Editor } from '@tinymce/tinymce-react';
export default function RichForm(props) {
    return (
        <>
        <textarea className="d-none"  ref={props.reference} value={props.pesan} id="myTextArea" readOnly></textarea>
        <Editor
            initialValue=""
            apiKey='njsvutrsf1m8e3koexowpglc5grb0z21ujbxpll08y9gvt23'
            init={{
                menubar: false,
                branding: false,
                elementpath: false,
                plugins: 'emoticons ',
                toolbar: 'emoticons | bold italic',
                setup: function (ed) {
                    ed.on('change', function (e) {
                        ed.save();
                    });
                    ed.on('keydown',function(e) {
                        if(e.shiftKey && e.key === "Enter"){
                            ed.execCommand('mceInsertNewLine');
                            e.preventDefault();
                        }
                        else if(e.key === "Enter"){
                            e.preventDefault();
                            props.kirimPesan({komunitasUID:props.KomunitasUID})
                        }
                    });
                    },
            }}
            value={props.pesan}
            onEditorChange={props.onEditorChange}
        />
        </>
    )
}
