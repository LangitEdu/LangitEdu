const BtnPrimary = (props)=>{
    return (
        <button type={props.type} className={props.customClass ? "btn btn-primary "+props.customClass : "btn btn-primary"  } disabled={props.loading}>
            {props.loading ? 
            <>
            <div className="spinner-border text-light spinner-border-sm mr-2" role="status">
            </div>
            Loading....
            </>
            :
            props.title
            }
        </button>
    )
}

export default BtnPrimary