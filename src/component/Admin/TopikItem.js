import React from 'react'

export default function TopikItem(props) {
    return (
        <div className="card">
            <div className="card-header" id={`heading${props.docid}`}>
            <h2 className="mb-0 d-flex justify-content-between">
                <button className="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target={`#collapse${props.docid}`} aria-expanded="false" aria-controls={`collapse${props.docid}`}>
                {props.nama}
                </button>
                <button className="btn btn-danger" onClick={props.deleteFunction} data-uid={props.docid} >Delete</button>
            </h2>
            </div>
            <div id={`collapse${props.docid}`} className="collapse" aria-labelledby={`heading${props.docid}`} data-parent="#listTopik">
                <div className="card-body">
                    {props.deskripsi}
                </div>
            </div>
        </div>
    )
}
