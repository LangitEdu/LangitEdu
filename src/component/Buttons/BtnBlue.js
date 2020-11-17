const BtnBlue = (props)=>{
    return (
        <button type={props.type} className={props.customClass ? "btn-bordered-blue "+props.customClass : "btn-bordered-blue"  } disabled={props.loading}>
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

export default BtnBlue