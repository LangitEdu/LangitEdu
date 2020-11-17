import React, { useRef, useState } from 'react'
import {Link, useHistory} from "react-router-dom";
import Dismissible from '../component/Alert/Dismissible';
import RouteName from '../config/Route';
import {useAuth} from '../contexts/AuthContext'
import Styled from '@emotion/styled'
import useResize from "use-resize"
import BtnBlue from '../component/Buttons/BtnBlue'

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
    const size = useResize()

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
        <Wrapper screen={size.width}>
        <div className="container d-flex align-items-center justify-content-center flex-column vh-100">
            {error &&
                <Dismissible type="danger" message={error} onClick={()=>{setError(false)}} />
            }
            <div className="card shadow text-center mt-3 py-4 px-md-3">
                <h1 className="font-weight-bold" >Register</h1>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input ref={nameRef} type="text" className="form-control" placeholder="Name" required />
                        </div>
                        <div className="form-group">
                            <input ref={emailRef} type="email" className="form-control" placeholder="Email address" required />
                        </div>
                        <div className="form-group">
                            <input ref={passwordRef} type="password" className="form-control" placeholder="Password" required />
                        </div>
                        <div className="form-group">
                            <input ref={confirmPasswordref} type="password" className="form-control" placeholder="Password" required />
                        </div>
                        <BtnBlue type="submit" title="Sign Up" loading={loading} customClass="shadow" />
                    </form>
                </div>
            </div>
            <p className="mt-5">Sudah punya akun ? <Link to={RouteName.login}>Ayo Login!</Link> </p>
            <p><Link to={RouteName.home}>Back to Home</Link> </p>
        </div>
        </Wrapper>
    )
}

const Wrapper = Styled.div(({screen})=>`

    a{
        color : #007A95;
    }
    .card{
        width : ${screen < 769 ? '90% !important' : '50% !important'};
        border-radius : 20px;
        border: none;
        background: #FAFAFA;

        .card-body{
            .form-control{
                padding : 1.6rem 1rem;
                border-radius: .5rem;
                border : 1px solid #D3D3D3;
                color : #828282;
            }
        }

    }
    .btn-bordered-blue{
        padding : .4rem 3rem;
    }

`)