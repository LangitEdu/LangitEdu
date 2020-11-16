import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { db, FieldValue } from '../../config/Firebase'
import {routeSet} from '../../config/Route'
import { useAuth } from '../../contexts/AuthContext'
import parse from 'html-react-parser';

export default function TopikItem(props) {
    const [ElementJourneyList, setElementJourneyList] = useState()
    const namaJourneyRef = useRef()
    const {currentUser} = useAuth()
    const [Loading, setLoading] = useState(false)
    const [Error, setError] = useState()
    
    const handleCreateKuis = (e)=>{
        e.preventDefault()
        setLoading(true)
        const namaJourney = namaJourneyRef.current.value
        if(namaJourney.length < 3){
            setError({message:'Nama kuis minimal 3 karakter'})
            setLoading(false)
            return ;
        }
        db.collection('Journey').add({
            name: namaJourney,
            created_by : {
                name : currentUser.displayName,
                uid : currentUser.uid,
                kuisList : []
            },
            created_at : FieldValue.serverTimestamp(),
            topikID : props.docid
        }).then(res=>{
            db.collection('Topik').doc(props.docid).update({
                journeyList : FieldValue.arrayUnion({nama:namaJourney, uid:res.id})
            }).then(()=>{
                setLoading(false)
                namaJourneyRef.current.value = ''
            }).catch(err=>{
                console.log(err)
                setLoading(false)
                setError(err)
            })
        }).catch(err=>{
            console.log(err)
            setLoading(false)
            setError(err)
        })
    }
    useEffect(() => {
        const handleDeleteJourney = (e)=>{
            const data = {
                nama: e.target.dataset.nama,
                uid : e.target.dataset.uid
            }
            setLoading(true)
            db.collection('Journey').doc(data.uid).delete().then(()=>{
                db.collection('Topik').doc(props.docid).update({
                    journeyList : FieldValue.arrayRemove(data)
                }).then(()=>{
                    setLoading(false)
                }).catch(err=>{
                    console.log(err);
                    setLoading(false)
                    setError(err)
                })
                return;
            }).catch(err=>{
                console.log(err);
                setLoading(false)
                setError(err)
            })
            return;
        }
        if(props.journeyList){
            setElementJourneyList(props.journeyList.map(data=>{
                return (
                    <li className="list-group-item d-flex justify-content-between" key={data.uid}>
                        <Link to={routeSet.liatJourney({uid:data.uid})} >{data.nama}</Link>
                        <button className="btn btn-danger" onClick={handleDeleteJourney} data-uid={data.uid} data-nama={data.nama}>Delete</button>
                    </li>)
            }))
        }
    }, [props])
    return (
        <div className="card">
            <div className="card-header" id={`heading${props.docid}`}>
            <h2 className="mb-0 d-flex justify-content-between">
                <button className="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target={`#collapse${props.docid}`} aria-expanded="false" aria-controls={`collapse${props.docid}`}>
                {props.nama}
                </button>
                <div className='d-flex'>
                <button className="btn btn-info mr-4" onClick={()=>{console.log('edit');}} data-uid={props.docid} >Edit</button>
                <button className="btn btn-danger" onClick={props.deleteFunction} data-uid={props.docid} data-thumbnail={props.ThumbnailRef} >Delete</button>
                </div>
            </h2>
            </div>
            <div id={`collapse${props.docid}`} className="collapse" aria-labelledby={`heading${props.docid}`} data-parent="#listTopik">
                <div className="card-body">
                    {parse(props.deskripsi)}
                    <br/>
                    <div className="card mt-4">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                {Error && 
                                <div className="alert alert-danger">
                                    {Error.message}
                                </div>
                                }
                                <form onSubmit={handleCreateKuis}>
                                    <div className="form-group row">
                                        <label htmlFor="nama" className="col-md-2 col-form-label">Nama Kuis</label>
                                        <div className="col-md-8">
                                            <input ref={namaJourneyRef} type="text" className="form-control" required />
                                        </div>
                                        <div className="col-md-2">
                                            <button type="submit" className="btn btn-primary" onClick={props.ShowModalBuatKuis} disabled={Loading}>
                                                <i className="fas fa-plus mr-2"></i> Buat Kuis
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </li>
                          {ElementJourneyList}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
