import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Dismissible from '../component/Alert/Dismissible';
import NotDismissible from '../component/Alert/NotDismissible';
import NavbarUser from '../component/Navbar/NavbarUser'
import {useAuth} from '../contexts/AuthContext'

export default function Dashboard() {
    const {currentUser, SendEmailVerification} = useAuth()
    const [success, setSuccess] = useState(false)
    console.log(currentUser);
    const hendleResendEmailVerify =async     (e)=>{
        e.preventDefault()
        setSuccess(false)
        await SendEmailVerification()
        setSuccess(true)
    }
    return (
        <>
        <NavbarUser/>
        <div className="container mt-5">
            <h1>Dashboard</h1>
            <h3>Hello {currentUser.displayName} </h3>
            {success &&
            <Dismissible type="success" message="Email berhasil dikirim, silahkan cek inbox anda" />
            }
            {!currentUser.emailVerified && 
            <NotDismissible type="warning" message={
                <>
                Harap Verifikasi Email anda, jika email tidak masuk silahkan mengajukan kirim ulang
                <br />
                <Link onClick={hendleResendEmailVerify}>Kirim Ulang</Link>
                </>
            } customClass="mt-4" />
            }
        </div>
        </>
    )
}
