import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { auth } from '../config/Firebase'
import RouteName from '../config/Route'

export default function ResetPassword(props) {
    const [Email, setEmail] = useState('')
    const [Loading, setLoading] = useState(false)
    const [Error, setError] = useState(false)
    const [ErrMessage, setErrMessage] = useState('')
    const history = useHistory()

    const PasswordRef = useRef()
    const ConfirmPasswordRef = useRef()

    useEffect(()=>{
        auth.verifyPasswordResetCode(props.actionCode).then((email)=>{
            setEmail(email)
        }).catch(err=>{
            setError(true)
            setErrMessage(err.messsage)
        })
    }, [props])

    const HandleResetPassword = (e)=>{
        e.preventDefault()
        setLoading(true)
        auth.confirmPasswordReset(props.actionCode, PasswordRef.current.value).then(function(resp) {
            history.push(RouteName.login)
          }).catch(function(error) {
            setError(true)
            console.log(error);
            setErrMessage(error.message)
            setLoading(false)
          });
    }

    const handleChangePass = (e)=>{
        setError(false)
        setErrMessage('')
        if((PasswordRef.current.value !== ConfirmPasswordRef.current.value) && ConfirmPasswordRef.current.value.length > 0  ){
            setError(true)
            setErrMessage('Password tidak sama')
        }
    }
    return (
        <div className="container d-flex align-items-center justify-content-center flex-column vh-100">
            <h1>Reset Password</h1>
            <h4>for {Email} </h4>
            <div className="card w-75 mt-3 p-md-3">
                <div className="card-body">
                    <form className="text-center" onSubmit={HandleResetPassword}>
                        <div className="form-group text-left">
                            <label htmlFor="password">New Password</label>
                            <input ref={PasswordRef} className={`form-control ${Error ? 'is-invalid' : ''} `} type="password" onChange={handleChangePass}/>
                            <div className={`invalid-feedback ${Error ? 'd-block' : ''} `}>{ErrMessage}</div>
                        </div>
                        <div className="form-group text-left">
                            <label htmlFor="confirmpassword">Confirm New Password</label>
                            <input ref={ConfirmPasswordRef} className={`form-control ${Error ? 'is-invalid' : ''} `} type="password"  onChange={handleChangePass} />
                            <div className={`invalid-feedback ${Error ? 'd-block' : ''} `}>{ErrMessage}</div>
                        </div>
                        <button className="btn btn-primary" disabled={Loading || Error}>Reset Password</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
