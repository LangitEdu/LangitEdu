import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react'
import OpsiItem from '../../component/TambahSoal/OpsiItem'
import { db, FieldValue } from '../../config/Firebase'

export default function TambahSoal() {
    const [KuisData, setKuisData] = useState()
    const {uid} = useParams()
    const [Loading, setLoading] = useState()
    const defaultOpsiList = ['A','B','C','D','E']
    const [isiOpsiA, setIsiOpsiA] = useState('')
    const [isiOpsiB, setIsiOpsiB] = useState('')
    const [isiOpsiC, setIsiOpsiC] = useState('')
    const [isiOpsiD, setIsiOpsiD] = useState('')
    const [isiOpsiE, setIsiOpsiE] = useState('')
    const [BodySoal, setBodySoal] = useState()
    const [BodyPembahasan, setBodyPembahasan] = useState()
    const arrIsiOpsi = [isiOpsiA, isiOpsiB, isiOpsiC, isiOpsiD, isiOpsiE]
    const arrSetIisiOpsi = [setIsiOpsiA, setIsiOpsiB, setIsiOpsiC, setIsiOpsiD, setIsiOpsiE]
    const [ListOpsi, setListOpsi] = useState(['A','B'])
    const [ItemOpsi, setItemOpsi] = useState(ListOpsi.map((type,i)=>{
        return <OpsiItem type={type} onEditorChange={arrSetIisiOpsi[i]} key={type}/>
    }))

    const NoRef = useRef()
    const JawababRef = useRef()

    const handleTambahOpsi = ()=>{
        const currentOpsiList = ListOpsi
        if(currentOpsiList.length < defaultOpsiList.length){
            currentOpsiList.push(defaultOpsiList[currentOpsiList.length])
            setListOpsi(currentOpsiList)
            setItemOpsi(ListOpsi.map((type,i)=>{
                return <OpsiItem type={type} value={arrIsiOpsi[i]} onEditorChange={arrSetIisiOpsi[i]} key={type}/>
            }))
        }
    }

    const handleHapusOpsi = ()=>{
        const currentOpsiList = ListOpsi
        if(currentOpsiList.length > 2){
            currentOpsiList.pop()
            arrSetIisiOpsi[currentOpsiList.length]()
            setListOpsi(currentOpsiList)
            setItemOpsi(ListOpsi.map(type=>{
                return <OpsiItem type={type} key={type}/>
            }))
        }
    }

    const handleBuatSoal = async (e)=>{
        e.preventDefault()
        setLoading(true)
        const options=[]
        const nomer = String(NoRef.current.value-1)

        arrIsiOpsi.forEach((data,i)=>{
            if(data){
                options.push({
                    body:data,
                    type:defaultOpsiList[i]
                })
            }
        })
        const data = {
            options:options,
            body : BodySoal,
            pembahasan :BodyPembahasan
        }
        const answer = {
            answer : JawababRef.current.value,
            id : NoRef.current.value-1
        }
        const SoalRef = db.collection('Kuis').doc(uid)
        SoalRef.collection('Questions').doc(nomer).set(data)
        .then( async()=>{
            const cekDoc = await SoalRef.collection('Answers').doc('kunci').get()
            if(cekDoc.exists){
                SoalRef.collection('Answers').doc('kunci').update({
                    body:FieldValue.arrayUnion(answer)
                }).then(()=>{
                    SoalRef.update({
                        listQuestion : FieldValue.arrayUnion({id:nomer})
                    }).then(()=>{
                        console.log('Berhasil update');
                        setLoading(false)
                    }).catch((err)=>{
                        console.log(err);
                        setLoading(false)
                    })
                })
            }else{
                SoalRef.collection('Answers').doc('kunci').set({
                    body : answer
                })
                .then(()=>{
                    SoalRef.update({
                        listQuestion : FieldValue.arrayUnion({id:nomer})
                    }).then(()=>{
                        console.log('Berhasil update');
                        setBodySoal()
                        setBodyPembahasan()
                        NoRef.current.value = ''
                        JawababRef.current.value = ''
                        setLoading(false)
                    }).catch((err)=>{
                        console.log(err);
                        setLoading(false)
                    })
                })
            }
        }).catch(err=>{
            console.log(err);
            setLoading(false)
        })
        
    }

    const handleHapusSoal = async(e)=>{
        const idSoal = e.target.dataset.id
        setLoading(true)
        db.collection('Kuis')
            .doc(uid)
            .collection('Questions')
            .doc(idSoal)
            .delete()
            .then(async ()=>{
                const data = await db.collection('Kuis')
                            .doc(uid)
                            .collection('Answers')
                            .doc('kunci')
                            .get()
                const newArray = data.data().body.filter((data)=>{
                    return data.id !== idSoal
                })

                await db.collection('Kuis')
                        .doc(uid)
                        .collection('Answers')
                        .doc('kunci')
                        .update({
                            body : newArray
                        })
                        .then(()=>{
                            console.log('Berhasil menghapus kus');
                            setLoading(false)
                        })
                        .catch(err=>{
                            console.log(err)
                            setLoading(false)
                        })
                await db.collection('Kuis')
                        .doc(uid)
                        .update({
                            listQuestion : FieldValue.arrayRemove({id:idSoal})
                        })
                        .catch(err=>{
                            console.log(err)
                            setLoading(false)
                        })

            })
            .catch(err=>{
                console.log(err);
                setLoading(false)
            })
    }

    useEffect(() => {
        const unsub = db.collection('Kuis').doc(uid).onSnapshot(doc=>{
            setKuisData(doc.data())
        })
        return unsub
    }, [uid])
    return (
        <div className="container mt-4">
            <h1>Tambah Soal {KuisData && KuisData.nama} </h1>
            <div className="row mt-4">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="mb-0">Tambah Soal</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleBuatSoal}>
                                <div className="form-group">
                                    <label htmlFor="no ">No</label>
                                    <input ref={NoRef} className="form-control" type="number" min='1' />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Soal">Soal</label>
                                    <Editor
                                        apiKey = 'njsvutrsf1m8e3koexowpglc5grb0z21ujbxpll08y9gvt23'
                                        init = {{
                                            menubar: false,
                                            min_height:400
                                        }}
                                        value={BodySoal}
                                        onEditorChange={setBodySoal}
                                    />
                                </div>
                                {ItemOpsi}
                                <button className="btn btn-primary mr-3" type="button" onClick={handleTambahOpsi} disabled={Loading} >Tambah Opsi</button>
                                <button className="btn btn-warning" type="button" onClick={handleHapusOpsi} disabled={Loading} >Hapus Opsi</button>
                                <div className="form-group">
                                    <label htmlFor="Jawaban">Jawaban</label>
                                    <select ref={JawababRef} className="form-control">
                                        {ListOpsi.map(type=>{
                                            return <option key={type}>{type}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Pembahasan">Pembahasan</label>
                                    <Editor
                                        apiKey = 'njsvutrsf1m8e3koexowpglc5grb0z21ujbxpll08y9gvt23'
                                        init = {{
                                            menubar: false,
                                            min_height:400
                                        }}
                                        value={BodyPembahasan}
                                        onEditorChange={setBodyPembahasan}
                                    />
                                </div>
                                <button className="btn btn-primary" disabled={Loading}>Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            List Soal
                        </div>
                        <ul className="list-group list-group-flush">
                            {KuisData && KuisData.listQuestion && 
                            KuisData.listQuestion.map(data=>{
                                return (
                                <li className="list-group-item d-flex justify-content-between" key={data.id} >
                                    Soal #{parseInt(data.id)+1}
                                    <div>
                                        <button type="buttom" className="btn btn-success mr-3" data-id={data.id} disabled={Loading} >Edit</button>
                                        <button type="buttom" className="btn btn-danger" data-id={data.id} onClick={handleHapusSoal} disabled={Loading} >Hapus</button>
                                    </div>
                                </li>
                                )
                            })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
