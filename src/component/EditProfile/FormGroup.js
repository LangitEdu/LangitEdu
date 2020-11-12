const FormGroup = (props)=>{
    return (
        <div className="form-group">
            <label>{props.label}</label>
            <input ref={props.refer} type={props.type ?? 'text'} className="form-control" defaultValue={props.defaultValue} onChange={props.onChange} />
        </div>
    )
}

export default FormGroup