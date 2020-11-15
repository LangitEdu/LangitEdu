import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { auth } from '../config/Firebase'
import RouteName from '../config/Route'

export default function EmailRecovery(props) {
    
    const [Sukses, setSukses] = useState(false)
    const [Loading, setLoading] = useState(true)
    const [Email, setEmail] = useState('')
    const history = useHistory()
    const handleChangePass = (e)=>{
        setLoading(true)
        auth.sendPasswordResetEmail(Email).then(function() {
            history.push(RouteName.login)
        }).catch(function(error) {
            console.log(error);
            setLoading(false)
        });

    }

    useEffect(()=>{
        auth.checkActionCode(props.actionCode).then(function(info) {
            console.log(info);
            setEmail(info['data']['email'])
            return auth.applyActionCode(props.actionCode);
          }).then(function() {
                setLoading(false)
                setSukses(true)
          }).catch(function(error) {
                setLoading(false)
                setSukses(false)
                console.log(error);
          });
    }, [props])

    return (
        <div className="container d-flex align-items-center justify-content-center flex-column vh-100">
            <h1>{!Loading ? Sukses ? 'Updated email address' : 'Error' : 'Loading...' }</h1>
            <div className="card w-75 mt-3 p-md-3">
                <div className="card-body">
                    {Loading ?
                    <p>Loadung...</p>
                    :
                    Sukses ?
                        <>
                        <p>
                        Your sign-in email address has been changed back to
                        </p>
                        <b> {Email} </b>
                        <p>If you didn’t ask to change your sign-in email, 
                            it’s possible someone is trying to access your account and you should
                        </p>
                        <button className="btn btn-info" onClick={handleChangePass} >Change Password</button>
                        </>
                        :
                        <>
                            <p><b>Error</b></p>
                            <Link className="btn btn-primary" to={RouteName.login}>Go to Login</Link>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}
