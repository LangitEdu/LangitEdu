import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function ForgotPassword() {
    const {resetPassword} = useAuth()

    const [Email, setEmail] = useState()
    const [Loading, setLoading] = useState(false)
    const [Success, setSuccess] = useState(false)
    const HandleResetPassword = async (e)=>{
        e.preventDefault()
        setSuccess(false)
        setLoading(true)
        try{
            await resetPassword(Email)
            setSuccess(true)
            setLoading(false)
        }catch(err){
            console.log(err);
            setLoading(false)
        }
    }

    return (
        <div className="container d-flex align-items-center justify-content-center flex-column vh-100">
            <h1>Forgot Password</h1>
            {Success &&
            <div className="alert alert-success">
                Berhasil mengirim request reset Password, silahkan cek inbox anda
            </div>
            }
            <div className="card w-75 mt-3 p-md-3">
                <div className="card-body">
                    <form className="text-center" onSubmit={HandleResetPassword}>
                        <div className="form-group text-left">
                            <label htmlFor="email">E-mail</label>
                            <input name="email" value={Email} onChange={(e)=>{setEmail(e.target.value)}} type="email" className="form-control"/>
                        </div>
                        <button className="btn btn-primary" disabled={Loading}>Reset Password</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
