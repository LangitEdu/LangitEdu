import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../component/Navbar/Navbar'
import { db } from '../../config/Firebase'

export default function HasilKuis() {
    const {kuisID} = useParams()
    const [ListNilai, setListNilai] = useState([])
    const [ListUser, setListUser] = useState([])
    const [KuisData, setKuisData] = useState('')
    const [Loading, setLoading] = useState(false)
    
    useEffect(()=>{
        const Query = db.collection('Kuis').doc(kuisID)
        Query.get().then(doc=>{
            setKuisData(doc.data())
        })
        const unsub = Query.collection('Nilai').onSnapshot(async(snapshot)=>{
            let arrNilai = []
            let arrUID = []
            snapshot.docs.forEach(doc=>{
                const data = doc.data()
                arrNilai.push(data)
                arrUID.push(data.uid)
            })
            
            if(arrNilai.length > 0){
                await db.collection('Profile').where('uid','in',arrUID)
                    .get()
                    .then(res=>{
                        let listUserData = []
                        res.docs.forEach(doc=>{
                            listUserData[doc.id] = doc.data()
                        })
                        setListUser(listUserData);
                        setListNilai(arrNilai)
                    })
            }
        })

        return unsub
    }, [kuisID])

    const handleDeleteNilai = async(e)=>{
        const {uid} = e.target.dataset
        setLoading(true)
        return await db.collection('Profile').doc(uid).collection('Kuis').doc(kuisID).delete()
        .then(async()=>{
            return await db.collection('Kuis').doc(kuisID).collection('Nilai').doc(uid).delete()
            .then(()=>{
                setLoading(false)
            })
            .catch(err=>{
                console.log('error di kuis',err);
                setLoading(false)
            })
        })
        .catch(err=>{
            console.log('err di profile',err);
            setLoading(false)
        })
    }

    return (
        <>
        <Navbar />
        <div className="container mt-5">
            <h1>Hasil {KuisData.nama} </h1>
            <div className="card mt-4">
                <div className="card-body py-1">
                    <div className="table-responsive mt-4">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nama</th>
                                <th scope="col">Nilai</th>
                                <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ListNilai.length > 0 ? ListNilai.map((data,i)=>(
                                    <tr key={data.uid}>
                                        <th scope="row">{i+1}</th>
                                        <td>{ ListUser[data.uid] ? ListUser[data.uid].displayName : '-'}</td>
                                        <td> {data.nilai} </td>
                                        <td>
                                            <button className="btn btn-danger" data-uid={data.uid} onClick={handleDeleteNilai} disabled={Loading} >Hapus</button>
                                        </td>
                                    </tr>
                                    ))
                                    :
                                    <tr>
                                        <th colSpan="5" className="text-center">Belum ada yang selesai mengerjakan</th>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
