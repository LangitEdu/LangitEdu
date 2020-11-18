import { Link } from "react-router-dom"

const Plus = (props)=>{
    return (

        <Link to={props.link}>
            <div className="card plus">
                <div className="card-body text-center">
                    {props.text}
                </div>
            </div>
        </Link>

    )
}

export default Plus