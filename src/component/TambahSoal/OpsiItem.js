import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
import UploadImage from '../../utils/UploadImgInTinyMCE'

export default function OpsiItem(props) {
    return (
        <div className="form-group">
            <label htmlFor={`opsi${props.type}`}>Opsi {props.type}</label>
            <Editor
                initialValue ={props.value}
                apiKey = 'njsvutrsf1m8e3koexowpglc5grb0z21ujbxpll08y9gvt23'
                init = {{
                    menubar: false,
                    branding: false,
                    min_height:400,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount image '
                      ],
                      toolbar: 'undo redo | formatselect | ' +
                      'bold italic backcolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | image ',
                    images_upload_handler: function (blobInfo, success, failure) {
                        const file = blobInfo.blob()
                        UploadImage(file, success, failure)
                      },
                }}
                value={props.value}
                onEditorChange={props.onEditorChange}
            />
        </div>
    )
}
