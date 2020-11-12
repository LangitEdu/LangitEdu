import React, { useEffect, useRef, useState } from 'react'
import Styled from '@emotion/styled'
import axios from 'axios';
import {useAuth} from '../contexts/AuthContext'
import Navbar from '../component/Navbar/NavbarBig';
import { db, FieldValue } from '../config/Firebase';
import TopikItem from '../component/Admin/TopikItem';


const Admin = () => {
    const [Verify, setVerify] = useState(false)
    const {currentUser, IsAdmin} = useAuth()
    const emailRef = useRef()
    const [Error, setError] = useState()
    const [Loading, setLoading] = useState(false)
    const TopikNameRef = useRef()
    const TopikDeskripsiRef = useRef()
    const JurusanRef = useRef()
    const [ListTopik, setListTopik] = useState()

    async function verify(e) {
        e.preventDefault()
        setVerify()
        setLoading(true)
        const tokenAdmin = await currentUser.getIdToken()
        const email = emailRef.current.value
        emailRef.current.value = ''
        const data ={
            email: email,
            tokenAdmin : tokenAdmin
        }
        axios.post('http://localhost:5001/langit-edu/asia-southeast2/api/make-admin',data)
        .then((res)=>{
            console.log(res.data);
            setVerify(res.data)
            setLoading(false)
        })
        .catch(err=>{
            console.log(err);
            setError(err)
            setLoading(false)
        })
    }   
    async function handleBuatTopik(e) {
        e.preventDefault()
        db.collection('Topik').add({
            nama : TopikNameRef.current.value,
            deskripsi : TopikDeskripsiRef.current.value,
            jurusan :  JurusanRef.current.value,
            created_at : FieldValue.serverTimestamp(),
            updated_at : FieldValue.serverTimestamp(),
            created_by : {
                nama : currentUser.displayName,
                uid : currentUser.uid
            },
            member : []
        }).then(res=>{
            TopikNameRef.current.value = ''
            JurusanRef.current.value = ''
            TopikDeskripsiRef.current.value = ''
            setVerify({message:'Berhasil membuat Topik'})
        }).catch(err=>{
            setError(err)
            return;
        })
    }
    async function handleDeleteTopik(e) {
        return db.collection('Topik').doc(e.target.dataset.uid).delete()
                .then(()=>{
                    console.log('Berhasil dihapus');
                }).catch(err=>{
                    setError(err)
                })
    }
    useEffect(() => {
        let unsub = db.collection('Topik').onSnapshot(snapShot=>{
            setListTopik(snapShot.docs.map(doc=>{
                return <TopikItem 
                    {...doc.data()}
                    key={doc.id}
                    docid={doc.id}
                    deleteFunction={handleDeleteTopik}
                />
            }))
        })
        return unsub
    }, [])

    return (
        <Wrapper>
            <Navbar />
            <div className="container mt-4">
                {Error && 
                <div className="alert alert-danger">
                    {Error.message} 
                </div>}
                {Verify && 
                <div className="alert alert-success">
                    {Verify.message}
                </div>}
            </div>
            <div className="container mt-4 mb-4">
                <h1>Set Admin</h1>
                <h2>{IsAdmin ? 'Admin' : 'Bukan admin'}</h2>
                <div className="card mt-4">
                    <div className="card-body">
                    <form onSubmit={verify}>
                        {Loading &&
                        <div className="mb-4">
                            <div className="spinner-border spinner-border-sm mr-2" role="status"></div>Loading...
                        </div>
                        }
                        <div className="form-group">
                            <input type="email" className='form-control' ref={emailRef} />
                        </div>
                        <button className='btn btn-primary' disabled={Loading}>Make Admin</button>
                    </form>
                    </div>
                </div>
            </div>

            <div className="container mt-4">
                <h2 className="mb-3">Buat Topik</h2>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleBuatTopik}>
                            <div className="form-group">
                                <label htmlFor="namaTopik">Nama Topik</label>
                                <input ref={TopikNameRef} type="text" className="form-control" id="namaTopik"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="deskripsiTopik">Deskripsi Topik</label>
                                <textarea ref={TopikDeskripsiRef} className="form-control" id="deskripsiTopik" cols="30" rows="10"></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="Jurusan">Pilih Jurusan</label>
                                <select ref={JurusanRef} className="form-control" id="Jurusan">
                                    <option value='mipa'>MIPA</option>
                                    <option value='ips'>IPS</option>
                            </select>
                            </div>
                            <button className="btn btn-primary" >Buat Topik</button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="container mt-3 pb-5">
                <div className="accordion" id="listTopik">
                    {ListTopik}
                </div>
            </div>
        </Wrapper>
    );
}
    
const Wrapper = Styled.div(() =>`
    
`)
    
export default Admin