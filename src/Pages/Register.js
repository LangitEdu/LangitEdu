import React, { useRef, useState } from 'react'
import {Link, useHistory} from "react-router-dom";
import Dismissible from '../component/Alert/Dismissible';
import BtnPrimary from '../component/Buttons/BtnPrimary';
import RouteName from '../config/Route';
import {useAuth} from '../contexts/AuthContext'

export default function Register() {
    // Ref
    let emailRef =  useRef()
    let passwordRef = useRef()
    let confirmPasswordref = useRef()
    let nameRef = useRef()
    // State
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    // Auth method
    const {signup} = useAuth()
    // Other
    const history = useHistory()

    const handleSubmit = async (e)=>{
        e.preventDefault()
        setLoading(true)
        setError('')
        if(passwordRef.current.value !== confirmPasswordref.current.value){
            setError("Password dan Confirm Password tidak sama !")
            setLoading(false)
            return
        }
        try{
            await signup({
                email : emailRef.current.value,
                password : passwordRef.current.value,
                name : nameRef.current.value
            }).then(()=>{
                history.push(RouteName.dashboard)
            })
        }catch(err){
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <div className="container d-flex align-items-center justify-content-center flex-column vh-100">
            <h1>Register</h1>
            {error &&
                <Dismissible type="danger" message={error} onClick={()=>{setError(false)}} />
            }
            <div className="card w-75 mt-3 p-md-3">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="Name">Name</label>
                            <input ref={nameRef} type="text" className="form-control" placeholder="Name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="Email">Email</label>
                            <input ref={emailRef} type="email" className="form-control" placeholder="Email address" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="Password">Password</label>
                            <input ref={passwordRef} type="password" className="form-control" placeholder="Password" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ConfirmPassword">Confirm Password</label>
                            <input ref={confirmPasswordref} type="password" className="form-control" placeholder="Password" required />
                        </div>
                        <BtnPrimary type="submit" title="Sign Up" loading={loading} customClass="m-auto px-4 d-block" />
                    </form>
                </div>
            </div>
            <p className="mt-4">Sudah punya akun ? <Link to={RouteName.login}>Ayo Login!</Link> </p>
            <p><Link to={RouteName.home}>Back to Home</Link> </p>
        </div>
    )
}
