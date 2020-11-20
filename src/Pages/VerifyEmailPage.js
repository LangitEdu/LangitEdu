import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../config/Firebase'
import RouteName from '../config/Route'
import { useAuth } from '../contexts/AuthContext'

export default function VerifyEmailPage(props) {

    const {currentUser} = useAuth()
    const [Sukses, setSukses] = useState(false)
    console.log(props.actionCode);
    useEffect(()=>{
        auth.applyActionCode(props.actionCode).then(function(resp) {
            console.log(resp);
            setSukses(true)
        })
        .catch(err=>{
            setSukses(false)
        })
    }, [props])

    return (
        <div className="container d-flex align-items-center justify-content-center flex-column vh-100">
            <h1>{Sukses ? `Verifikasi Email Berhasil` : 'Error'}</h1>
            <div className="card w-75 mt-3 p-md-3">
                <div className="card-body text-center">
                    <p className="mb-3" style={{fontSize:'1.5rem'}}>{`Silahkan menuju ${currentUser ? 'Beranda' : 'Login page'}`}</p>
                    {currentUser ?
                    <a className="btn btn-primary" href={RouteName.dashboard}>Beranda</a>
                    :
                    <Link className="btn btn-primary" to={RouteName.login}>Login</Link>
                    }
                </div>
            </div>
        </div>)
}
