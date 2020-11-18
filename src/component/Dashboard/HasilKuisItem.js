import { Link } from "react-router-dom";
import moment from 'moment';

const HasilKuisItem = (props)=>{
    return (

        <div className="kuis-item mb-4">
            <div className="row flex-column-reverse flex-md-row">
                <div className="col-md-10">
                    <div className="card">
                        <div className="card-body">
                            <Link to={'#'}>
                                <h3>{props.title}</h3>
                            </Link>
                            <div className="d-flex justify-content-between flex-row mt-3">
                                <p>{moment.unix(props.date).format('DD/MM/YYYY HH:mm')}</p>
                                <Link to={"#"} >Detail Hasil <i className="fas fa-angle-right"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-2 mb-3 align-self-stretch">
                    <div className="card score h-100">
                        <div className="card-body d-flex justify-content-center align-items-center">
                            <h3>{Math.floor(props.nilai)}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default HasilKuisItem;