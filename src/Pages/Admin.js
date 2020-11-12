import React, { useRef, useState } from 'react'
import Styled from '@emotion/styled'
import axios from 'axios';
import {useAuth} from '../contexts/AuthContext'
import Navbar from '../component/Navbar/NavbarBig';
const Admin = () => {
    const [Verify, setVerify] = useState(false)
    const {currentUser, IsAdmin} = useAuth()
    const emailRef = useRef()
    const [Error, setError] = useState()
    const [Loading, setLoading] = useState(false)

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

    return (
        <Wrapper>
            <Navbar />
            <div className="container mt-4 mb-4">
                <h1>Set Admin</h1>
                <h2>{IsAdmin ? 'Admin' : 'Bukan admin'}</h2>
                {Verify && 
                <div className="alert alert-success">
                    {Verify.message}
                </div>}
                {Error && 
                <div className="alert alert-danger">
                    {Error} 
                </div>}
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
                <h2>Buat Topik</h2>
                <div className="card">
                    <div className="card-body">
                        <form >
                            <div className="form-group">
                                <label htmlFor="namaTopik">Nama Topik</label>
                                <input type="text" className="form-control" id="namaTopik"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="deskripsiTopik">Deskripsi Topik</label>
                                <textarea className="form-control" id="deskripsiTopik" cols="30" rows="10"></textarea>
                            </div>
                            <button className="btn btn-primary" >Buat Topik</button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="container mt-3">
                
            </div>
        </Wrapper>
    );
}
    
const Wrapper = Styled.div(() =>`
    
`)
    
export default Admin