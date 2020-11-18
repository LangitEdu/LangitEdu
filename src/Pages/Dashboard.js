import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Dismissible from '../component/Alert/Dismissible';
import NotDismissible from '../component/Alert/NotDismissible';
import Navbar from '../component/Navbar/Navbar'
import {useAuth} from '../contexts/AuthContext'
import { db } from '../config/Firebase';
import {routeSet} from '../config/Route'
import FooterCopyright from '../component/FooterCopyright';
import styled from '@emotion/styled';

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

        db.collection("Topik")
        .where("member", "array-contains", currentUser.uid).onSnapshot(snapshot=>{
           if(!snapshot.empty){
            setTopikCard(snapshot.docs.map((doc, i)=>{
                const data = doc.data()
                return (
                    <div className="card" style={{width: "18rem"}} key={i}>
                        <img src={data.thumbnail} className="card-img-top" alt={`thumbnail ${data.nama} `} />
                        <div className="card-body">
                            <h5 className="card-title">{data.nama}</h5>
                            <Link className="btn btn-primary" to={routeSet.gotoTopik({topikKey:data.topikKey})}>Cek Topik</Link>
                        </div>
                    </div>
                )
            }))
           }else{
               setTopikCard('Belum ada topik')
           }
        })
    }, [currentUser])
    
    return (
        <Wrapper>
        <Navbar />
        <div className="container mt-5 min-vh-100">
            <h1>Beranda</h1>
            <br/>
            <hr/>
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
        <FooterCopyright />
        </Wrapper>
    )
}

const Wrapper = styled.div(()=>`

    h1{
        color : #209FBC;
        font-size : 5rem;
    }

`)
