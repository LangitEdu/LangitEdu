import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import './navbar.css';
import RouteName, {routeSet} from '../../config/Route';

const NavbarGuest =(props)=>{
    const {currentUser, logout} = useAuth();
    const history = useHistory();
    
    const handleLogout = async (e)=>{
        e.preventDefault();
        try{
            await logout();
            history.push(RouteName.login);
        }catch(err){
            props.SetError(err)
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand font-weight-bold" to={RouteName.home}> Langit Edu </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        
                    </ul>
                    {currentUser ?
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {
                                        <>
                                        <img src={currentUser.photoURL} alt="Profile" className="profile img-fluid mr-3"/>
                                        {currentUser.displayName}
                                        </>
                                    }
                                </Link>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <Link className="dropdown-item" to={RouteName.dashboard}>Dashboard</Link>
                                    <Link className="dropdown-item" to={routeSet.editProfile({uid:currentUser.uid})}>Edit Profile</Link>
                                    <div className="dropdown-divider"></div>
                                    <Link className="dropdown-item" to="#" onClick={handleLogout} >Logout</Link>
                                </div>
                            </li>
                        </ul>
                    :
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to={RouteName.login}>Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={RouteName.register}>Register</Link>
                            </li>
                        </ul>
                    }
                </div>
            </div>
        </nav>
    )
}

export default NavbarGuest