import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Dismissible from '../component/Alert/Dismissible';
import NotDismissible from '../component/Alert/NotDismissible';
import Navbar from '../component/Navbar/Navbar'
import {useAuth} from '../contexts/AuthContext'
import { db } from '../config/Firebase';
import {routeSet} from '../config/Route'

export default function Dashboard() {
    const {currentUser, SendEmailVerification} = useAuth()
    const [success, setSuccess] = useState(false)
    const [topikCard, setTopikCard] = useState(()=>{ return(<><div className="spinner-border mr-1 spinner-border-md" role="status"></div>Loadding...</>)})
    const [Error, setError] = useState()
    const hendleResendEmailVerify =async (e)=>{
        e.preventDefault()
        setSuccess(false)
        try{
            await SendEmailVerification()
        }catch(err){
            setError(err.message)
        }
        setSuccess(true)
    }

    useEffect(() => {
        let docRef = db.collection("Profile").doc(currentUser.uid);
        docRef.get().then(function(doc) {
            if(doc.exists && doc.data().topik.length > 0){
                setTopikCard(doc.data().topik.map((data)=>{
                    return (
                        <div className="card" style={{width: "18rem"}} key={data.topik_uid}>
                            <img src={data.thumbnail} className="card-img-top" alt={`thumbnail ${data.name} `} />
                            <div className="card-body">
                                <h5 className="card-title">{data.name}</h5>
                                <Link className="btn btn-primary" to={routeSet.gotoTopik({topik_uid:data.topik_uid})}>Cek Topik</Link>
                            </div>
                        </div>
                    )
                }))
            }else{
                setTopikCard("Belum ada topik")
            }

        })
    }, [currentUser])
    
    return (
        <>
        <Navbar />
        <div className="container mt-5">
            <h1>Beranda</h1>
            <h3>Hello {currentUser.displayName} </h3>
            {success &&
            <Dismissible type="success" message="Email berhasil dikirim, silahkan cek inbox anda" />
            }
            {Error &&
            <Dismissible type="danger" message={Error} />
            }
            {!currentUser.emailVerified &&
                <NotDismissible type="warning" message={
                    <>
                    Harap Verifikasi Email anda, jika email tidak masuk silahkan mengajukan kirim ulang
                    <br />
                    <Link to="#" onClick={hendleResendEmailVerify}>Kirim Ulang</Link>
                    </>
                } customClass="mt-4" />
            }
            <div className="mt-4">
                {currentUser.emailVerified && topikCard}
            </div>
        </div>
        </>
    )
}
