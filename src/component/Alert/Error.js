const ErrorAlert= (props)=>{
    return (
        <div className="alert alert-danger alert-dismissible fade show">
            {props.error}
            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={props.onClick}>
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    )
}

export default ErrorAlert