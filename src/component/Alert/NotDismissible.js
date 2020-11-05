const NotDismissible= (props)=>{
    return (
        <div className={`alert alert-${props.type} ${props.customClass}`}>
            {props.message}
        </div>
    )
}

export default NotDismissible