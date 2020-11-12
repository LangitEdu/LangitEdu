const Dismissible= (props)=>{
    return (
        <div className={`alert alert-${props.type} alert-dismissible fade show`}>
            {props.message}
            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={props.onClick}>
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    )
}

export default Dismissible