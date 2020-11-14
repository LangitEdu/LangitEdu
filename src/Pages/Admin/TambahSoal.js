import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react'
import OpsiItem from '../../component/TambahSoal/OpsiItem'
import { db, FieldValue } from '../../config/Firebase'

export default function TambahSoal() {
    const [KuisData, setKuisData] = useState()
    const [OnEdit, setOnEdit] = useState(false)
    const {uid} = useParams()
    const [Loading, setLoading] = useState()    
    const defaultOpsiList = ['A','B','C','D','E']
    const [isiOpsiA, setIsiOpsiA] = useState('')
    const [isiOpsiB, setIsiOpsiB] = useState('')
    const [isiOpsiC, setIsiOpsiC] = useState('')
    const [isiOpsiD, setIsiOpsiD] = useState('')
    const [isiOpsiE, setIsiOpsiE] = useState('')
    const [BodySoal, setBodySoal] = useState()
    const [Jawaban, setJawaban] = useState()
    const [BodyPembahasan, setBodyPembahasan] = useState()
    let arrIsiOpsi = useMemo(()=>{return [isiOpsiA, isiOpsiB, isiOpsiC, isiOpsiD, isiOpsiE]},[isiOpsiA, isiOpsiB, isiOpsiC, isiOpsiD, isiOpsiE])
    let arrSetIisiOpsi = useMemo(() => {return [setIsiOpsiA, setIsiOpsiB, setIsiOpsiC, setIsiOpsiD, setIsiOpsiE]}, [setIsiOpsiA, setIsiOpsiB, setIsiOpsiC, setIsiOpsiD, setIsiOpsiE])
    const [ListOpsi, setListOpsi] = useState(['A','B'])
    const [ItemOpsi, setItemOpsi] = useState(ListOpsi.map((type,i)=>{
        return <OpsiItem type={type} onEditorChange={arrSetIisiOpsi[i]} key={type}/>
    }))

    const NoRef = useRef()

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
            answer : Jawaban,
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
                        setLoading(false)
                        return resetForm
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
    const handleSubmitEdit = (e)=>{
        e.preventDefault()
        console.log(e);
    }
    const resetForm = ()=>{
        setOnEdit(false)
        setBodySoal('')
        setBodyPembahasan('')
        setIsiOpsiA('')
        setIsiOpsiB('')
        setIsiOpsiC('')
        setIsiOpsiD('')
        setIsiOpsiE('')
        setJawaban('')
        setListOpsi(['A','B'])
        setItemOpsi(ListOpsi.map((type,i)=>{
            return <OpsiItem type={type} onEditorChange={arrSetIisiOpsi[i]} key={type}/>
        }))
        NoRef.current.value = 1
    }
    const handleEditSoal = async (e)=>{
        setOnEdit(true)
        const idSoal = e.target.dataset.id
        db.collection('Kuis')
            .doc(uid)
            .collection('Questions')
            .doc(idSoal)
            .get()
            .then(res=>{
                const {body, options, pembahasan} = res.data();
                setBodySoal(body)
                setBodyPembahasan(pembahasan)
                let resListOpsi = []

                options.forEach(data=>{
                    resListOpsi.push(data.type)
                    
                    switch (data.type) {
                        case 'A':
                            setIsiOpsiA(data.body)
                            break;
                        case 'B':
                            setIsiOpsiB(data.body)
                            break;
                        case 'C':
                            setIsiOpsiC(data.body)
                            break;
                        case 'D':
                            setIsiOpsiD(data.body)
                            break;
                        default:
                            setIsiOpsiE(data.body)
                            break;
                    }
                    setListOpsi(resListOpsi)
                })
                const excludeOpsi = defaultOpsiList.filter((data)=>{
                    let diff = true;
                    for (let i = 0; i < resListOpsi.length; i++) {
                        if(data === resListOpsi[i]){
                            diff= false
                        }
                        
                    }
                    return diff
                })
                excludeOpsi.forEach(data=>{
                    switch (data) {
                        case 'A':
                            setIsiOpsiA('')
                            break;
                        case 'B':
                            setIsiOpsiB('')
                            break;
                        case 'C':
                            setIsiOpsiC('')
                            break;
                        case 'D':
                            setIsiOpsiD('')
                            break;
                        default:
                            setIsiOpsiE('')
                            break;
                    }
                })
                db.collection('Kuis')
                    .doc(uid)
                    .collection('Answers')
                    .doc('kunci')
                    .get()
                    .then(res=>{
                        setJawaban(res.data().body[idSoal].answer)
                    })
                NoRef.current.value = parseInt(idSoal)+1
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
    useEffect(()=>{
        setItemOpsi(ListOpsi.map((type,i)=>{
            return <OpsiItem type={type} value={arrIsiOpsi[i]} onEditorChange={arrSetIisiOpsi[i]} key={type}/>
        }))
    }, [ListOpsi, arrSetIisiOpsi, arrIsiOpsi])
    
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
                            <h4 className="mb-0">
                                {OnEdit ? 
                                <>
                                <span className="mr-3" >Edit Soal</span>
                                <button className="btn btn-success" onClick={resetForm} >Cancel</button>
                                </>
                                : 
                                'Tambah Soal'
                                }
                            </h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={ OnEdit ? handleSubmitEdit : handleBuatSoal}>
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
                                    <select value={Jawaban} onChange={(e)=>{setJawaban(e.target.value)}} className="form-control">
                                        {ListOpsi.map(type=>{
                                            return <option key={type} value={type} >{type}</option>
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
                            KuisData.listQuestion.sort((a,b)=>{
                                if(parseInt(a.id) < parseInt(b.id)){
                                    return -1
                                }else{
                                    return 1
                                }
                            }) &&
                            KuisData.listQuestion.map(data=>{
                                return (
                                <li className="list-group-item d-flex justify-content-between" key={data.id} >
                                    Soal #{parseInt(data.id)+1}
                                    <div>
                                        <button type="buttom" className="btn btn-success mr-3" data-id={data.id} disabled={Loading} onClick={handleEditSoal} >Edit</button>
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
