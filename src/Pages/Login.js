import React, { useRef, useState } from 'react'
import {Link, useHistory} from "react-router-dom";
import Dismissible from '../component/Alert/Dismissible';
import RouteName from '../config/Route';
import {useAuth} from '../contexts/AuthContext'
import Styled from '@emotion/styled'
import useResize from "use-resize"
import BtnOrange from '../component/Buttons/BtnOrange';

export default function Login() {

    const emailRef = useRef()
    const passwordRef = useRef()

    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)

    const {login} = useAuth()
    const history = useHistory()
    const size = useResize()
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
        <Wrapper screen={size.width}>
        <div className="container d-flex align-items-center justify-content-center flex-column vh-100">
            {error &&
                <Dismissible type="danger" message={error} onClick={()=>{setError(false)}} />
            }
            <div className="card shadow mt-3 py-5 text-center">
                <h1 className="font-weight-bold" >Login</h1>
                <div className="card-body px-md-5">
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <input ref={emailRef} type="email" className="form-control" placeholder="Email" />
                        </div>
                        <div className="form-group">
                            <input ref={passwordRef} type="password" className="form-control" placeholder="Password" />
                        </div>
                        <div>
                            <Link className="btn mr-3" to={RouteName.forgetPassword} >Lupa Password ?</Link>
                            <BtnOrange customClass='shadow' type="submit" title="Login" loading={loading} />
                        </div>
                    </form>
                </div>
            </div>
            <p className="mt-5">Belum punya akun ? <Link to={RouteName.register}>Ayo Buat Akun!</Link> </p>
            <p><Link to={RouteName.home}>Back to Home</Link> </p>
        </div>
        </Wrapper>
    )
}

const Wrapper = Styled.div(({screen})=>`

    a{
        color : #FFA252;
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
            }
        }

    }
    .btn-bordered{
        padding : .4rem 3rem;
    }


`)