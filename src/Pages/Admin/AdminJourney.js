import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { Link, useHistory, useParams } from 'react-router-dom'
import Navbar from '../../component/Navbar/Navbar';
import { db, FieldValue } from '../../config/Firebase';
import { routeSet } from '../../config/Route';
import Styled from '@emotion/styled'

export default function AdminJourney() {
    let {uid} = useParams()
    const [Journey, setJourney] = useState()
    const [Loading, setLoading] = useState(false)
    const [ListKuis, setListKuis] = useState()
    const [OnEdit, setOnEdit] = useState(false)
    const [isPublish, setIsPublish] = useState(false)
    const namaKuisRef = useRef()
    const durasiKuisRef = useRef()
    const [CurrentEditKuis, setCurrentEditKuis] = useState()
    const [oldKuisData, setOldKuisData] = useState()
    const history = useHistory()

    const handleBuatKuis = async (e)=>{
        e.preventDefault()
        setLoading(true)
        await db.collection('Kuis').add({
            nama: namaKuisRef.current.value,
            durasi : durasiKuisRef.current.value,
            journeyID:uid,
            publish:isPublish,
            listQuestion:[]
        }).then((res)=>{
            db.collection('Journey').doc(uid).update({
                kuisList : FieldValue.arrayUnion({nama:namaKuisRef.current.value, uid:res.id, durasi : durasiKuisRef.current.value,publish:isPublish})
            }).then(()=>{
                console.log('Berhasil dibuat');
                history.push(routeSet.tambahSoal({uid:res.id}))
            }).catch(err=>{
                console.log(err);
                setLoading(false)
            })
        }).catch(err=>{
            console.log(err);
        })
        namaKuisRef.current.value = '';
        durasiKuisRef.current.value = '';
    }
    const handleEditKuis = (e)=>{
        e.preventDefault()
        setLoading(true)
        const nama = namaKuisRef.current.value
        const durasi = durasiKuisRef.current.value
        db.collection('Kuis').doc(CurrentEditKuis).update({
           durasi : durasi,
           nama : nama,
           journeyID : uid ,
           publish:isPublish
        }).then( async ()=>{
            await db.collection('Journey').doc(uid).update({
                kuisList:FieldValue.arrayRemove(oldKuisData),
            })
            await db.collection('Journey').doc(uid).update({
                kuisList:FieldValue.arrayUnion({nama:nama, durasi:durasi, uid:CurrentEditKuis, publish:isPublish})
            })
            setOnEdit(false)
            setIsPublish(false)
            setLoading(false)
            namaKuisRef.current.value = '';
            durasiKuisRef.current.value = '';
        }).catch(err=>{
            console.log(err);
            setLoading(false)
        })
        
    }   
    const handlePublishChange=(e)=>{
        setIsPublish(e.target.checked)
    }
    const ChangeToEdit = (e)=>{
        setOnEdit(true)
        const {nama, uid, durasi, publish} = e.target.dataset
        namaKuisRef.current.value = nama
        durasiKuisRef.current.value = durasi
        setCurrentEditKuis(uid)
        setIsPublish(publish==='true')
        setOldKuisData({nama:nama, durasi:durasi, uid:uid, publish:publish==='true'})
    }
    const CancelEdit = (e)=>{
        setOnEdit(false)
        setIsPublish(false)
        namaKuisRef.current.value = ''
        durasiKuisRef.current.value = ''
        setCurrentEditKuis()
        setOldKuisData()
    }
    useEffect(() => {
        let unsub = db.collection('Journey').doc(uid).onSnapshot(doc=>{
            if (doc.exists) {
                const hapusKuis = (e)=>{
                    const KuisUID = e.target.dataset.uid
                    const durasi = e.target.dataset.durasi
                    const namaKuis = e.target.dataset.nama
        
                    db.collection('Kuis').doc(KuisUID).delete()
                    .then(()=>{
                            db.collection('Journey').doc(uid).update({
                                kuisList: FieldValue.arrayRemove({
                                    uid:KuisUID, 
                                    nama:namaKuis, 
                                    durasi:durasi,
                                })
                            })
                            .then(()=>{
                                console.log('Berhasil Menghapus Data');
                            }).catch(err=>{
                                console.log(err)
                            })
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                }
                const data = doc.data()
                setJourney(data)
                if(data.kuisList && data.kuisList.length > 0){
                    data.kuisList.sort((a,b)=>{
                        if(a.nama.toLowerCase() < b.nama.toLowerCase()){
                            return -1
                        }else if(a.nama.toLowerCase() > b.nama.toLowerCase()){
                            return 1
                        }
                        else{
                            return 0
                        }
                    })
                    setListKuis(data.kuisList.map(data=>{
                        return (
                            <li className="list-group-item" key={data.uid}>
                                <h4>{data.nama} | ({data.durasi} Menit) </h4>
                                <hr/>
                                <div className="d-flex">
                                    <Link className="btn btn-primary mr-3" to={routeSet.tambahSoal({uid:data.uid})} >Kelola Soal</Link>
                                    <Link className="btn btn-primary mr-3" to={routeSet.lihatHasilKuis({kuisID : data.uid })} >Lihat Hasil</Link>
                                    <button className="btn btn-info mr-3" onClick={ChangeToEdit} data-publish={data.publish} data-durasi={data.durasi} data-uid={data.uid} data-nama={data.nama}>Edit Kuis</button>
                                    <button className="btn btn-danger" data-durasi={data.durasi} data-uid={data.uid} data-nama={data.nama} onClick={hapusKuis}>Hapus Kuis</button>
                                </div>
                            </li>
                        )
                    }))
                }else{
                    setListKuis(
                    <li className="list-group-item">
                        <p>Belum ada Kuis</p>
                    </li>)
                }
            }else{
                setJourney()
            }
        })
        return unsub
    }, [uid])



    return (
        <>
        <Helmet>
            <title>Admin Journey | Langit Edu</title>
        </Helmet>
        <Navbar />
        <div className="container mt-4 d-flex justify-content-center">
            <Wrapper>
                <h1>{Journey && Journey.nama}</h1>

                <div className="card mt-5 btn-shadow">
                    <div className="card-header">
                        <h4 className="mb-0 font-weight-bold">{OnEdit ? 'Edit Kuis' : 'Tambah Kuis'}</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={OnEdit ? handleEditKuis : handleBuatKuis}>
                            <div className="custom-control custom-switch">
                                <input onChange={handlePublishChange} type="checkbox" className="custom-control-input" id="isPublish" checked={isPublish} />
                                <label className="custom-control-label" htmlFor="isPublish">Publish Kuis</label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="nama">Nama Kuis</label>
                                <input className="form-control" type="text" ref={namaKuisRef} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="durasi">Durasi Kuis (menit)</label>
                                <input ref={durasiKuisRef} className="form-control" type="number"/>
                            </div>
                            <button className="btn btn-primary mr-3" disabled={Loading} >Submit</button>
                            {OnEdit && 
                            <button type='button' className="btn btn-success" onClick={CancelEdit}>Cancel Edit</button>
                            }
                        </form>
                    </div>
                </div>

                <div className="card mt-4 btn-shadow">
                    <ul className="list-group list-group-flush">
                        {ListKuis}
                    </ul>
                </div>
            </Wrapper>
        </div>
        </>
    )
}

const Wrapper = Styled.div(() =>`
    max-width:850px;
    width: 90%;
    padding: 32px 0 54px 0;

    h1{
        font-family: Raleway;
        font-style: normal;
        font-weight: 800;
        font-size: 51px;
        line-height: 60px;

        /* Gray 1 */

        color: #333333;
    }

    .btn-shadow{
        border-radius: 12px !important;
    }
`)