import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../component/Navbar/Navbar'
import { db } from '../../config/Firebase'

export default function HasilKuis() {
    const {kuisID} = useParams()
    const [ListNilai, setListNilai] = useState([])
    const [ListUser, setListUser] = useState([])
    useEffect(()=>{
        let arrNilai = []
        let arrUID = []
        const unsub = db.collection('Kuis').doc(kuisID).collection('Nilai').onSnapshot(snapshot=>{
            snapshot.docs.forEach(doc=>{
                const data = doc.data()
                arrNilai.push(data)
                arrUID.push(data.uid)
            })
            setListNilai(arrNilai)
            if(arrNilai.length > 0){
                db.collection('Profile').where('uid','in',arrUID)
                    .get()
                    .then(res=>{
                        let listUserData = []
                        res.docs.forEach(doc=>{
                            const data = doc.data()
                            listUserData[data.uid] = data
                        })
                        setListUser(listUserData);
                    })
            }
        })

        return unsub
    }, [kuisID])

    return (
        <>
        <Navbar />
        <div className="container mt-5">
            <h1>Hasil Kuis</h1>
            <div className="card mt-4">
                <div className="card-body py-1">
                    <div className="table-responsive mt-4">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nama</th>
                                <th scope="col">Nilai</th>
                                <th scope="col">Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ListNilai.length > 0 ? ListNilai.map((data,i)=>(
                                    <tr key={data.uid}>
                                    <th scope="row">{i+1}</th>
                                    <td>{ListUser[data.uid].displayName}</td>
                                    <td> {data.nilai} </td>
                                    <td>action?</td>
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
