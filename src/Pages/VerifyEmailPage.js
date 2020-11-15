import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../config/Firebase'
import RouteName from '../config/Route'
import { useAuth } from '../contexts/AuthContext'

export default function VerifyEmailPage(props) {

    const {currentUser} = useAuth()
    const [Sukses, setSukses] = useState(false)
    const [Loading, setLoading] = useState(true)
    console.log(props.actionCode);
    useEffect(()=>{
        auth.applyActionCode(props.actionCode).then(function(resp) {
            console.log(resp);
            setSukses(true)
            setLoading(false)
        })
        .catch(err=>{
            setSukses(false)
            setLoading(false)
        })
    }, [props])

    return (
        <div className="container d-flex align-items-center justify-content-center flex-column vh-100">
            <h1>{Sukses ? 'Error' :`Verifikasi Email Berhasil`}</h1>
            <div className="card w-75 mt-3 p-md-3">
                <div className="card-body text-center">
                    <p className="mb-3" style={{fontSize:'1.5rem'}}>{`Silahkan menuju ${currentUser ? 'Beranda' : 'Login page'}`}</p>
                    {currentUser ?
                    <Link className="btn btn-primary" to={RouteName.dashboard}>Beranda</Link>
                    :
                    <Link className="btn btn-primary" to={RouteName.login}>Login</Link>
                    }
                </div>
            </div>
        </div>)
}
