const BtnOrange = (props)=>{
    return (
        <button type={props.type} className={props.customClass ? "btn-bordered "+props.customClass : "btn-bordered"  } disabled={props.loading}>
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

export default BtnOrange