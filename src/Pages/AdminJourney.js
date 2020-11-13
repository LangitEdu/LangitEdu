import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db, FieldValue } from '../config/Firebase';

export default function Journey() {
    let {uid} = useParams()
    const [Journey, setJourney] = useState()
    const [Loading, setLoading] = useState(false)
    const [ListKuis, setListKuis] = useState()
    const namaKuisRef = useRef()

    const handleBuatKuis = async (e)=>{
        e.preventDefault()
        setLoading(true)
        await db.collection('Kuis').add({
            nama: namaKuisRef.current.value,
            journeyID:uid
        }).then((res)=>{
            db.collection('Journey').doc(uid).update({
                kuisList : FieldValue.arrayUnion({nama:namaKuisRef.current.value, uid:res.id})
            }).then(()=>{
                setLoading(false)
            }).catch(err=>{
                console.log(err);
                setLoading(false)
            })
        }).catch(err=>{
            console.log(err);
        })
        namaKuisRef.current.value = ''
    }

    useEffect(() => {
        db.collection('Journey').doc(uid).onSnapshot(doc=>{
            if (doc.exists) {
                const data = doc.data()
                setJourney(data)
                setListKuis(data.kuisList.map(data=>{
                    return (
                        <li className="list-group-item" key={data.uid}>{data.nama}</li>
                    )
                }))
            }else{
                setJourney()
            }
        })

    }, [uid])
    return (
        <div className="container mt-4">
            <h1>{Journey && Journey.name}</h1>

            <div className="card mt-5">
                <div className="card-header">
                    <h4 className="mb-0 font-weight-bold">Tambah Kuis</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleBuatKuis}>
                        <div className="form-group">
                            <label htmlFor="">Nama Kuis</label>
                            <input className="form-control" type="text" ref={namaKuisRef} />
                        </div>
                        <button className="btn btn-primary" disabled={Loading} >Submit</button>
                    </form>
                </div>
            </div>

            <div className="card mt-4">
                <ul className="list-group list-group-flush">
                    {ListKuis}
                </ul>
            </div>
        </div>
    )
}
