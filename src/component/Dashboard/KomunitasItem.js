import { Link } from "react-router-dom"

const KomunitasItem = (props)=>{
    return (

        <div className="card mb-4">
            <div className="card-body">
                <div className="row">
                    <div className="col-md-2">
                        <div className="thumbnail">
                            <img src={props.thumb} alt="Thumbnail"/>
                        </div>
                    </div>
                    <div className="col-md-10 py-md-3">
                        <div className="detail mb-2">
                            <Link to={props.link}>
                                <h3>{props.title}</h3>
                            </Link>
                        </div>
                        <Link to={props.link} >Masuk Room <i className="fas fa-angle-right"></i></Link>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default KomunitasItem