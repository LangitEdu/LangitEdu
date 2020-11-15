import React, { useRef, useState } from 'react'
import {Link, useHistory} from "react-router-dom";
import Dismissible from '../component/Alert/Dismissible';
import BtnPrimary from '../component/Buttons/BtnPrimary';
import RouteName from '../config/Route';
import {useAuth} from '../contexts/AuthContext'

export default function Login() {

    const emailRef = useRef()
    const passwordRef = useRef()

    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)

    const {login} = useAuth()
    const history = useHistory()

    const handleLogin = async (e)=>{
        e.preventDefault()
        setLoading(true)
        setError('')
        try{
            await login({
                email : emailRef.current.value,
                password : passwordRef.current.value
            })
            history.push(RouteName.dashboard)
        }catch(err){
            console.log(err);
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <div className="container d-flex align-items-center justify-content-center flex-column vh-100">
            <h1>Login</h1>
            {error &&
                <Dismissible type="danger" message={error} onClick={()=>{setError(false)}} />
            }
            <div className="card w-75 mt-3 p-md-3">
                <div className="card-body">
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="Email">Email</label>
                            <input ref={emailRef} type="email" className="form-control" placeholder="Email address" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="Password">Password</label>
                            <input ref={passwordRef} type="password" className="form-control" placeholder="Password" />
                        </div>
                        <Link to={RouteName.forgetPassword} >Lupa Password ?</Link>
                        <BtnPrimary type="submit" title="Login" loading={loading} customClass="m-auto px-4 d-block" />
                    </form>
                </div>
            </div>
            <p className="mt-4">Belum punya akun ? <Link to={RouteName.register}>Ayo Buat Akun!</Link> </p>
            <p><Link to={RouteName.home}>Back to Home</Link> </p>
        </div>
    )
}
