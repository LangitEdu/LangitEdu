import moment from 'moment'

const Komunitas = (props)=>{
    return (
        <li className="person d-flex align-items-center" data-chat={props.komunitas_uid} onClick={props.onClick}>
            <div className="user" >
                <img src={props.photoUrl} alt={props.nama} />
            </div>
            <div className="d-flex justify-content-between w-100 align-items-center">
            <div className="d-none d-md-block" >
                <h5 className="name align-self-center" id={`namaRoom_${props.komunitas_uid}`} >{props.nama}</h5>
                <p className="name-time d-flex justify-content-between w-100 align-items-center">
                    <span className="time">{moment.unix(props.lastChat.seconds).fromNow()}</span>
                </p>
            </div>
            {props.join &&
                <div>
                    <button className="btn btn-success" onClick={props.onClick} ><i className="fas fa-plus"></i></button>
                </div>
            }
            </div>
            <hr/>
        </li>
    )
}

export default Komunitas