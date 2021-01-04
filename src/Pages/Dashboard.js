import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Dismissible from '../component/Alert/Dismissible';
import NotDismissible from '../component/Alert/NotDismissible';
import Navbar from '../component/Navbar/Navbar'
import {useAuth} from '../contexts/AuthContext'
import { db } from '../config/Firebase';
import RouteName, {routeSet} from '../config/Route'
import FooterCopyright from '../component/FooterCopyright';
import styled from '@emotion/styled';
import useResize from "use-resize"
import TopikItem from '../component/Dashboard/TopikItem';
import KomunitasItem from '../component/Dashboard/KomunitasItem';
import HasilKuisItem from '../component/Dashboard/HasilKuisItem';
import Plus from '../component/Dashboard/Plus';
import parse from 'html-react-parser'
import { Helmet } from 'react-helmet';

export default function Dashboard() {
    const {currentUser, SendEmailVerification} = useAuth()
    const [savedJurusan, setsavedJurusan] = useState()
    const [success, setSuccess] = useState(false)
    const [topikCard, setTopikCard] = useState([])
    const [KomunitasCard, setKomunitasCard] = useState([])
    const [KuisCard, setKuisCard] = useState([])
    const [Error, setError] = useState()
    const size = useResize()
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
        .where("member", "array-contains", currentUser.uid).get().then(snapshot=>{
            setTopikCard(snapshot.docs)
        })
        db.collection('Komunitas').where('member', "array-contains",  currentUser.uid).get().then(res=>{
            setKomunitasCard(res.docs)
        })
        db.collection('Profile').doc(currentUser.uid).collection('Kuis').get().then(res=>{
            setKuisCard(res.docs)
        })
        db.collection('Profile').doc(currentUser.uid).get().then(doc=>{
            setsavedJurusan(doc.data().savedJurusan)
        })
    }, [currentUser])
    
    return (
        <Wrapper screen={size.width}>
        <Navbar />
        <Helmet>
            <title>Beranda | Langit Edu</title>
        </Helmet>
        <div className="container mt-5 min-vh-100">
            <h1>Beranda</h1>
            <hr className="mt-4 mb-4" />
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
            {currentUser.emailVerified && 
            
            <div className="row py-4 py-md-1">

                <div className="col-md-3 mb-4">
                    <h2><strong>Profil</strong></h2>
                    <div className="card mt-4">
                        <div className="card-body d-flex justify-content-center flex-column align-items-center">
                            <div className="profile mb-4 ">
                                <img src={currentUser.photoURL} alt="Profile"/>
                            </div>
                            <div className="mb-3 text-center">
                                <h4 className="mb-2" >{currentUser.displayName}</h4>
                                <p>{currentUser.email}</p>
                            </div>
                            <Link className="btn-bordered-blue shadow-sm" to={RouteName.editProfile} >Edit Profile</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-1">

                </div>
                <div className="col-md-8">
                    <h2><strong>Topik Terdaftar</strong></h2>
                    
                    <div className="listTopik my-4">
                        {topikCard.length > 0 &&
                        
                        topikCard.map(doc=>{
                            const data = doc.data()
                            return <TopikItem
                            key={doc.id}
                            link={routeSet.gotoTopik({topikKey:data.topikKey})}
                            title = {data.nama}
                            desc={parse(data.deskripsi)}
                            thumb = {data.thumbnail}
                            />
                        })  

                        }

                        <Plus
                            link={RouteName.topik}
                            text={<span className="fas fa-plus"></span>}

                        />

                    </div>
                    <br/>
                    <h2><strong>Komunitas dan Diskusi</strong></h2>
                    <div className="listKomunitas my-4">
                        {KomunitasCard.length > 0 &&
                            KomunitasCard.map(doc=>{
                                const data = doc.data()
                                return <KomunitasItem 
                                        key={doc.id}
                                        title = {data.nama}
                                        link={RouteName.listKomunitas}
                                        thumb={data.photoUrl}
                                    />
                            })
                        }
                        
                        <Plus
                            link={RouteName.listKomunitas}
                            text={<span className="fas fa-plus"></span>}

                        />
                        
                    </div>
                    
                    <br/>
                    <h2><strong>Jurusan Tersimpan</strong></h2>
                    <div className="jurusan-card card p-4 mt-4">
                        <p>{savedJurusan}</p>
                        <Link to={RouteName.RekomendasiJurusan}>Jelajahi Jurusan <i className="fas fa-angle-right"></i></Link>
                    </div>
                    <br/>
                    
                    <h2><strong>Hasil Kuis Terbaru</strong></h2>
                    <div className="listHasilKuis my-4">
                        
                        {KuisCard.length > 0 &&
                        KuisCard.map(doc=>{
                            const data= doc.data()
                            return <HasilKuisItem
                                key={doc.id}
                                title = {data.namaKuis}
                                nilai = {data.body}
                                date = {data.timestamp.seconds}
                                link={routeSet.kuisresult({kuisID:data.kuisID})}
                            />
                        })
                        }
                        <div className="card plus">
                            <div className="card-body text-center">
                            {'LIHAT RIWAYAT KUIS LAINNYA MELALUI JOURNEY'}
                            </div>
                        </div>
                    </div>

                </div>


            </div>            
            
            }
        </div>
        <div className="mt-5">
            <FooterCopyright />
        </div>
        </Wrapper>
    )
}

const Wrapper = styled.div(({screen})=>`
    .jurusan-card{
        
        p{
            font-size: 20px;
            font-weight: bold;
            text-transform: capitalize;
        }
    }

    h1{
        color : #209FBC;
        font-size : 4rem;
    }
    .profile{
        overflow:hidden;
        border-radius:100%;
        width : 75%;

        img{
            width: 100%;
            height: auto;
            object-fit: cover;
        }

    }
    .card{
        border-radius:.5rem;
        border: none;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
        .detail {
            ${screen<769 ? 'margin-top: 2rem;' : ''}
            width : ${screen<769 ? '100%' : '75%'};
            
            h3{
                font-size : 3rem;
            }
            p{
                font-size : 1.2rem;
            }
        }
        a{
            font-size:1.2rem;
            h3{
                color : black;
                transition : .3s;
            }
        }
        a:hover{
            h3{
                color : #FFA252;
            }
        }
    }
    .listHasilKuis{
        .card.score{
            .card-body{
                h3{
                    font-size: 3.5rem;
                    padding: .2rem 0;
                    color: #FFA252;
                }
            }
        }
        .card.plus{
            .card-body{
                font-size: 1rem;
            }
        }
    }
    .card.plus{
        box-shadow : none;
        border: 2px solid #209FBC;
        .card-body{
            font-size:1.7rem;
            padding: .7rem;
        }
    }
    .listKomunitas {
        .card{
            .card-body{
                .thumbnail{
                    border-radius:100%;
                }
                .detail{
                    h3{
                        font-size : 2.5rem
                    }
                }
            }
        }
    }
    .btn-bordered-blue{
        padding : .4rem 3rem;
    }
    .thumbnail{
        overflow:hidden;
        border-radius : 1rem;
        
        img{
            object-fit: cover;
            width:100%;
        }
    
    }
`)
