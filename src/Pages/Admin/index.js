import React, { useEffect, useRef, useState } from 'react'
import Styled from '@emotion/styled'
import axios from 'axios';
import {useAuth} from '../../contexts/AuthContext'
import Navbar from '../../component/Navbar/NavbarBig';
import { db, FieldValue, storage } from '../../config/Firebase';
import TopikItem from '../../component/Admin/TopikItem';
import { Helmet } from 'react-helmet';
import { Editor } from '@tinymce/tinymce-react';
import UploadImage from '../../utils/UploadImgInTinyMCE';


const Admin = () => {
    const [Verify, setVerify] = useState(false)
    const {currentUser, IsAdmin} = useAuth()
    const emailRef = useRef()
    const [Error, setError] = useState()
    const [Loading, setLoading] = useState(false)
    const [TopikDeksripsi, setTopikDeksripsi] = useState('')
    const TopikNameRef = useRef()
    const JurusanRef = useRef()
    const ThumbnailRef = useRef()
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
        setLoading(true)
        let URL = 'https://avatars.dicebear.com/api/jdenticon/acsascaca.svg'
        let Ref  = ''

        if(ThumbnailRef.current.files.length > 0){
            const file = ThumbnailRef.current.files[0]
            let extention = file.name.split('.').pop();
            let res = await storage.ref('TopikThumbnail')
                    .child(TopikNameRef.current.value+"."+extention).put(file)
                    .catch(function(error) {
                        setError(error);
                        throw new Error(error.message)
                      });
            URL = await res.ref.getDownloadURL()
            Ref = `TopikThumbnail/${TopikNameRef.current.value}.${extention}`
        }
        db.collection('Topik').add({
            nama : TopikNameRef.current.value,
            deskripsi : TopikDeksripsi,
            jurusan :  JurusanRef.current.value,
            created_at : FieldValue.serverTimestamp(),
            updated_at : FieldValue.serverTimestamp(),
            thumbnail : URL,
            thumbnailRef : Ref,
            created_by : {
                nama : currentUser.displayName,
                uid : currentUser.uid
            },
            member : [],
            kuislist:[]
        }).then((res)=>{
            TopikNameRef.current.value = ''
            JurusanRef.current.value = 'MIPA'
            setTopikDeksripsi('')
            document.getElementById('thumbpic').src = 'https://avatars.dicebear.com/api/jdenticon/acsascaca.svg'
            document.getElementById('labelNewThumbnail').innerHTML = 'Choose file'
            setVerify({message:'Berhasil membuat Topik'})
            setLoading(false)
        }).catch(err=>{
            setError(err)
            setLoading(false)
            return;
        })
    }
    async function handleDeleteTopik(e) {
        setLoading(true)
        if(e.target.dataset.thumbnail !== undefined && e.target.dataset.thumbnail !==''){
            await storage.ref().child(e.target.dataset.thumbnail).delete()
            .then(()=>{
                console.log('Berhasil menghapus data');
            })
            .catch(err=>{
                setError(err)
                return;
            })
        }
       
        return db.collection('Topik').doc(e.target.dataset.uid).delete()
                .then(()=>{
                    console.log('Berhasil dihapus');
                    setLoading(false)
                }).catch(err=>{
                    setError(err)
                    setLoading(false)
                })
    }
    const handleThumbnailChange = (e)=>{
        setError()
        if(e.target.files.length > 0){
            let name
            const file = e.target.files[0]
            const AcceptAbleExtention = ['png','jpeg','jpg']
            let extention = file.name.split('.').pop();
            if(!AcceptAbleExtention.includes(extention.toLowerCase())){
                setError({message:"anda mengupload file dengan ekstensi yang tidak diizinkan, silahkan upload file yang lain"});
                document.getElementById('thumbpic').src = 'https://avatars.dicebear.com/api/jdenticon/acsacas.svg'
                return;
            }
            if(file.size > 5242880){
                setError({message:'Ukuran file yang anda upload terlalu besar, harap upload file yang berukuran tidak lebih dari 5MB'})
                document.getElementById('thumbpic').src = 'https://avatars.dicebear.com/api/jdenticon/acsascaca.svg'
                return
            }
            
            if(file.name.length < 40){
                name = file.name
            }else{
                name = file.name.substring(0,40)+"...."
            }
            var reader = new FileReader();
    
            reader.onload = function(e) {
                document.getElementById('thumbpic').src = e.target.result
            }
            reader.readAsDataURL(file);
            document.getElementById('labelNewThumbnail').innerHTML = name
        }else{
            document.getElementById('thumbpic').src = 'https://avatars.dicebear.com/api/jdenticon/acsascaca.svg'
            document.getElementById('labelNewThumbnail').innerHTML = 'Choose file'
        }
    }
    useEffect(() => {
        let unsub = db.collection('Topik').onSnapshot(snapShot=>{
            setListTopik(snapShot.docs.map(doc=>{
                const data = doc.data()
                return <TopikItem 
                    {...data}
                    key={doc.id}
                    docid={doc.id}
                    deleteFunction={handleDeleteTopik}
                    ThumbnailRef={data.thumbnailRef}
                />
            }))
        })
        return unsub
    }, [])

    return (
        <Wrapper>
            <Navbar />
            <Helmet>
                <title>Admin | Langit Edu</title>
            </Helmet>
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

                            <div className="thumbpic mb-4" style={{maxWidth:'10rem',maxHeight:'10rem',overflow:'hidden',borderRadius:"100%"}}>
                                <img id="thumbpic" src={`https://avatars.dicebear.com/api/jdenticon/acsascaca.svg`} alt="Thumbnail" className="img-fluid"/>
                            </div>
                            <div className="form-group">
                                <div className="custom-file">
                                    <input ref={ThumbnailRef} type="file" className="custom-file-input" id="newProfilePic" onChange={handleThumbnailChange} accept=".png,.jpg,.jpeg"/>
                                    <label id="labelNewThumbnail" className="custom-file-label" htmlFor="newProfilePic">Choose file</label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="namaTopik">Nama Topik</label>
                                <input ref={TopikNameRef} type="text" className="form-control" id="namaTopik"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="deskripsiTopik">Deskripsi Topik</label>
                                <Editor
                                    apiKey = 'njsvutrsf1m8e3koexowpglc5grb0z21ujbxpll08y9gvt23'
                                    init = {{
                                        menubar: false,
                                        plugins: [
                                            'advlist autolink lists link image charmap print preview anchor',
                                            'searchreplace visualblocks code fullscreen',
                                            'insertdatetime media table paste code help wordcount image '
                                          ],
                                          toolbar: 'undo redo | formatselect | ' +
                                          'bold italic backcolor | alignleft aligncenter ' +
                                          'alignright alignjustify | bullist numlist outdent indent | ' +
                                          'removeformat | image ',
                                        min_height:400,
                                        images_upload_handler: function (blobInfo, success, failure) {
                                            const file = blobInfo.blob()
                                            UploadImage(file, success, failure)
                                          },
                                    }}
                                    value={TopikDeksripsi}
                                    onEditorChange={setTopikDeksripsi}
                                    
                                />
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