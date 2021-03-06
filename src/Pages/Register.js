import React, { useState } from 'react'
import {Link, useHistory} from "react-router-dom";
import Dismissible from '../component/Alert/Dismissible';
import RouteName from '../config/Route';
import {useAuth} from '../contexts/AuthContext'
import Styled from '@emotion/styled'
import useResize from "use-resize"
import { Helmet } from 'react-helmet';

export default function Register() {
    // State
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    // Auth method
    const {signInWithGoogle} = useAuth()
    // Other
    const history = useHistory()
    const size = useResize()

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            setError('')
            setLoading(true)
            await signInWithGoogle()
            history.push(RouteName.dashboard)
        } catch(err){
            setError(err.message);
        }
        setLoading(false)
    }

    return (
        <Wrapper screen={size.width}>
        <Helmet>
            <title>Register | Langit Edu</title>
        </Helmet>
        <div className="container d-flex align-items-center justify-content-center flex-column vh-100">
            {error &&
                <Dismissible type="danger" message={error} onClick={()=>{setError(false)}} />
            }
            <div className="card shadow text-center mt-3 py-4 px-md-3">
                <h1 className="font-weight-bold" >Register</h1>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                    <button className="btn btn-lg btn-google px-5 text-uppercase btn-outline" to="#" disabled={loading}>
                            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="logo Google" /> Signup Using Google
                        </button>
                    </form>
                </div>
            </div>
            <p className="mt-5"><Link to={RouteName.home}>Back to Home</Link> </p>
        </div>
        </Wrapper>
    )
}

const Wrapper = Styled.div(({screen})=>`

    a{
        color : #007A95;
    }
    .btn-google {
        color: #545454;
        background-color: #ffffff;
        box-shadow: 0 1px 2px 1px #ddd
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