import { Link } from "react-router-dom";

const TopikItem = (props) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row">
          <div className="col-md-3">
            <div className="thumbnail">
              <img src={props.thumb} alt="Thumbnail" />
            </div>
          </div>
          <div className="col-md-9">
            <div className="detail mb-3">
              <Link to={props.link}>
                <h3>{props.title}</h3>
              </Link>
              {props.desc}
            </div>
            <Link to={props.link}>
              Lihat Topik <i className="fas fa-angle-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopikItem;
