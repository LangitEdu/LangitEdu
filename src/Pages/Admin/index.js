import React, { useEffect, useRef, useState } from 'react'
import Styled from '@emotion/styled'
import axios from 'axios';
import {useAuth} from '../../contexts/AuthContext'
import Navbar from '../../component/Navbar/Navbar'
import { API_URL, db, FieldValue, storage } from '../../config/Firebase'
import TopikItem from '../../component/Admin/TopikItem'
import { Helmet } from 'react-helmet'
import { Editor } from '@tinymce/tinymce-react'
import UploadImage from '../../utils/UploadImgInTinyMCE'
import useResize from 'use-resize'
import FooterCopyright from '../../component/FooterCopyright';

const Admin = () => {
    const [openTopikForm, setopenTopikForm] = useState(false)
    const [TopikDeksripsi, setTopikDeksripsi] = useState('')
    const [CurrentTopikId, setCurrentTopikId] = useState('')
    const [Loading, setLoading] = useState(false)
    const [ListTopik, setListTopik] = useState()
    const [Verify, setVerify] = useState(false)
    const [OnEdit, setOnEdit] = useState(false)
    const [Error, setError] = useState()
    const screen = useResize().width
    const {currentUser} = useAuth()
    const TopikNameRef = useRef()
    const ThumbnailRef = useRef()
    const TopikKeyRef = useRef()
    const JurusanRef = useRef()
    const emailRef = useRef()

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
        axios.post(`${API_URL}/make-admin`,data)
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
            URL = await storage.ref('TopikThumbnail')
                    .child(TopikNameRef.current.value+"."+extention).put(file)
                    .then(async (res)=>{
                        return await res.ref.getDownloadURL()
                    })
                    .catch(function(error) {
                        setError(error);
                        return;
                      });
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
            topikKey: TopikKeyRef.current.value.toLowerCase(),
            member : [],
            kuislist:[]
        }).then((res)=>{
            TopikNameRef.current.value = ''
            JurusanRef.current.value = 'MIPA'
            TopikKeyRef.current.value = ''
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
    async function handleChangetoEditTopik(e){
        setopenTopikForm(true)
        const {uid} = e.target.dataset
        setCurrentTopikId(uid)
        db.collection('Topik').doc(uid).get().then(doc=>{
            setOnEdit(true)
            const data = doc.data()
            TopikNameRef.current.value = data.nama
            JurusanRef.current.value = data.jurusan
            TopikKeyRef.current.value = data.topikKey
            setTopikDeksripsi(data.deskripsi)
            document.getElementById('thumbpic').src = data.thumbnail
            document.getElementById('labelNewThumbnail').innerHTML = data.thumbnailRef.split('/').pop() !== '' ? data.thumbnailRef.split('/').pop() : 'Choose file';
        }).catch(err=>{
            setError(err)
            setOnEdit(false)
        })
    }
    const handleSubmitEdit = async (e)=>{
        e.preventDefault()
        setLoading(true)
        let data = {
            nama : TopikNameRef.current.value,
            jurusan : JurusanRef.current.value,
            topikKey : TopikKeyRef.current.value,
            deskripsi : TopikDeksripsi,
        }
        if(ThumbnailRef.current.files.length > 0){
            const file = ThumbnailRef.current.files[0]
            let extention = file.name.split('.').pop();
            data.thumbnail =  await storage.ref('TopikThumbnail')
                    .child(TopikNameRef.current.value+"."+extention).put(file)
                    .then(async (res)=>{
                        return await res.ref.getDownloadURL()
                    })
                    .catch(function(error) {
                        setError(error);
                        return;
                      });
           
            data.thumbnailRef = `TopikThumbnail/${TopikNameRef.current.value}.${extention}`
        }
        await db.collection('Topik').doc(CurrentTopikId).update(data)
        .then(()=>{
            setCurrentTopikId('')
            setOnEdit(false)
            setLoading(false)
            TopikNameRef.current.value = ''
            JurusanRef.current.value = ''
            TopikKeyRef.current.value = ''
            setTopikDeksripsi('')
            document.getElementById('thumbpic').src = 'https://avatars.dicebear.com/api/jdenticon/acsascaca.svg'
            document.getElementById('labelNewThumbnail').innerHTML = 'Choose file';
        }).catch(err=>{
            console.log(err);
            setError(err)
            setLoading(false)
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
        await db.collection('Topik').doc(e.target.dataset.uid).delete()
                .then(()=>{
                    console.log('Berhasil dihapus');
                    setLoading(false)
                }).catch(err=>{
                    setError(err)
                    setLoading(false)
                    return false;
                })
        
        const batch = db.batch();
        await db.collection("Journey")
            .where("topikID", "==", e.target.dataset.uid)
            .get()
            .then(async (res)=>{
                const ListJourney = []
                res.docs.forEach(doc=>{
                    ListJourney.push(doc.id)
                    batch.delete(doc.ref)
                })
                batch.commit();
                if(ListJourney.length > 0){
                    const ListKuis = await db.collection("Kuis")
                                    .where("journeyID", "in", ListJourney)
                                    .get().catch(err=>{
                                        console.log(err);
                                        setLoading(false)
                                        setError(err)
                                        return false;
                                    })
                    const batch2 = db.batch()
                    if(ListKuis.length > 0){
                        ListKuis.forEach(async (doc)=>{
                            batch2.delete(doc.ref)
                            const ListQuestions = await doc.ref.collection('Questions').get()
                            ListQuestions.forEach(docQuestion=>{
                                batch2.delete(docQuestion.ref)
                            })
                            const ListAnswers = await doc.ref.collection('Answers').get()
                            ListAnswers.forEach(docAnswer=>{
                                batch2.delete(docAnswer.ref)
                            })
                            const ListNilai = await doc.ref.collection('Nilai').get()
                            ListNilai.forEach(docNilai=>{
                                batch2.delete(docNilai.ref)
                            })
                        })
                    }
                    batch2.commit()
                }
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
                    editFunction={handleChangetoEditTopik}
                />
            }))
        })
        return unsub
    }, [])

    return (
        <Wrapper screen={screen} openTopikForm={openTopikForm}>
            <Navbar />
            <Helmet>
                <title>Admin | Langit Edu</title>
            </Helmet>
            <div className="container">
                {Error && 
                <div className="alert alert-danger mt-4">
                    {Error.message} 
                </div>}
                {Verify && 
                <div className="alert alert-success mt-4">
                    {Verify.message}
                </div>}
            </div>
            <div className="gantivh">
            <div className="setadmin">
                <div className="contain-size">
                    <h1>Admin Control</h1>
                    <div className="setadmin-cont">
                        <h2>SET ADMIN</h2>
                        <p>Menjadikan seorang member langitEdu menjadi role admin</p>
                        <form onSubmit={verify}>
                            {Loading &&
                            <div className="mb-4">
                                <div className="spinner-border spinner-border-sm mr-2" role="status"></div>Loading...
                            </div>
                            }
                            <div className="form-inner">
                                <input type="email" className='form-control' ref={emailRef} placeholder="Email terkait"/>
                                <button className='btn-bordered btn-shadow' disabled={Loading}>SET</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="kelolatopik">   
                <div className="contain-size">
                    <h2>KELOLA TOPIK</h2>
                    <div className="makenewtopik" onClick={() => !openTopikForm ? setopenTopikForm(true) : ''}>
                        <p>{OnEdit ? 'Edit topik' : 'Buat topik baru'}</p>
                        {openTopikForm && 
                            <button className="btn-bordered-red" onClick={() => {setopenTopikForm(false); setOnEdit(false); setTopikDeksripsi("")}}>BATALKAN</button>
                        }
                        {!openTopikForm && <svg width="67" height="67" viewBox="0 0 67 67" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M29.6714 3.82857C29.6714 1.71411 31.3855 0 33.5 0C35.6145 0 37.3286 1.71411 37.3286 3.82857V63.1714C37.3286 65.2859 35.6145 67 33.5 67C31.3855 67 29.6714 65.2859 29.6714 63.1714L29.6714 3.82857Z" fill="#A9D8E3"/><path d="M63.1714 29.6714C65.2859 29.6714 67 31.3855 67 33.5C67 35.6145 65.2859 37.3286 63.1714 37.3286L3.82857 37.3286C1.71411 37.3286 -9.2426e-08 35.6145 0 33.5C9.2426e-08 31.3855 1.71411 29.6714 3.82857 29.6714L63.1714 29.6714Z" fill="#A9D8E3"/></svg>}
                    </div>
                    
                    {openTopikForm && 
                        <div className="container form-makenewtopik mt-4">
                            <div className="card btn-shadow">
                                <div className="card-body">
                                    <div className="row p-md-3">
                                        <div className="col-md-3 d-flex justify-content-center ">
                                            <div className="thumbpic mb-4" style={{width:'10rem',maxHeight:'10rem',overflow:'hidden',borderRadius:"100%"}}>
                                                <img id="thumbpic" src={`https://avatars.dicebear.com/api/jdenticon/acsascaca.svg`} alt="Thumbnail" className="img-fluid"/>
                                            </div>
                                        </div>
                                        <div className="col-md-9">
                                            <form onSubmit={ OnEdit ? handleSubmitEdit : handleBuatTopik}>

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
                                                    <label htmlFor="topikKey">Topik Key</label>
                                                    <input ref={TopikKeyRef} type="text" className="form-control"/>
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
                                                            branding: false,
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
                                                <button className="btn btn-primary btn-block" disabled={Loading} > {OnEdit ? 'Update Topik' : 'Buat Topik'} </button>
                                            </form>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>

            <div className="container con-ac pb-5">
                <div className="accordion" id="listTopik">
                    {ListTopik}
                </div>
            </div>
            </div>
            <div className="mt-5">
                <FooterCopyright />
            </div>
        </Wrapper>
    );
}
    
const Wrapper = Styled.div(({screen, openTopikForm}) =>`

    .gantivh{
        min-height: 100vh;
    }
    .contain-size{
        max-width: 858px;
        width: 90%;
        min-width: 340px;
    }

    .con-ac{
        width: 90%;
        max-width: 858px;
        padding: 0;
    }
    .accordion{
        width: 100%;
        max-width: 858px;
    }

    .kelolatopik{
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 32px;
        
        .contain-size{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0;
            flex-direction: column;
        }        

        .form-makenewtopik{
            padding: 0;

            .card{
                border-radius: 8px;
            }
        }

        .makenewtopik{
            max-width: 100%;
            width: 100%;
            min-width: 340px;
            height: 124px;

            border: ${openTopikForm ? 'none' : '2px solid #209FBC'};
            box-sizing: border-box;
            border-radius: 8px;

            display: flex;
            justify-content: space-between;
            padding: 0 32px;
            margin-bottom: 24px;
            align-items: center;

            &:hover{
                background: #209fbc22;
            }

            p{
                font-family: Raleway;
                font-style: normal;
                font-weight: 800;
                font-size: ${openTopikForm ? '48px' :'32px'};
                line-height: 36px;

                /* tosca */

                color: #209FBC;
            }
        }
        
        h2{
            max-width: 100%;
            width: 100%;
            min-width: 340px;
            margin-bottom: 24px;
            height: 63px;
            /* tosca */

            background: #209FBC;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
            border-radius: 8px;

            display: flex;
            justify-content: flex-start;
            align-items: center;

            padding-left: 24px;
            
            font-family: Raleway;
            font-style: normal;
            font-weight: 800;
            font-size: 31px;
            line-height: 36px;

            /* white */

            color: #FFFFFF;
        }
    }
  
    .setadmin{
        padding: 54px 0;
        box-shadow:inset 0 -20px 12px -12px rgba(0,0,0,0.20);
        display: flex;
        justify-content: center;
        align-items: center;

        .contain-size{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0;
            ${screen < 882 ? 'flex-direction: column;' : ''}
        }

        .setadmin-cont{
            max-width: 500px;
            width: 100%;
            min-width: 340px;
            height: 291px;

            background: #FAFAFA;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: column;
            padding: 24px 24px;

            form{                
                max-width: 448px;
                width: 100%;
                min-width: 340px;
                padding: 0 4px;

                .form-inner{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    
                    width: 100%;
                    
                    .btn-bordered{
                        padding: 6px 16px;
                        border-radius: 12px;
                        margin-left: 12px;
                    }
                    input{
                        width: 100%;
                        height: 48px;
                        
                        background: #FFFFFF;
                        border: 1px solid #D3D3D3;
                        box-sizing: border-box;
                        border-radius: 8px;
                        font-family: Oxygen;
                        font-style: normal;
                        font-weight: normal;
                        font-size: 16px;
                        line-height: 27px;

                        padding-left: 18px;

                        color: black;
                        &:placeholder{
                            /* Gray 3 */
                            color: #828282;
                        }
                    }
                }
            }
                
            p{
                font-family: Oxygen;
                font-style: normal;
                font-weight: normal;
                font-size: 21px;
                line-height: 27px;
                text-align: center;

                /* Gray 3 */

                color: #828282;
                max-width: 448px;
                width: 100%;
                min-width: 340px;
            }

            h2{
                max-width: 448px;
                width: 100%;
                min-width: 340px;
                height: 63px;

                /* tosca */

                background: #209FBC;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
                border-radius: 8px;

                display: flex;
                justify-content: center;
                align-items: center;

                font-family: Raleway;
                font-style: normal;
                font-weight: 800;
                font-size: 31px;
                line-height: 36px;
                text-align: center;

                /* white */

                color: #FFFFFF;
            }
        }

        h1{
            max-width: 400px;
            font-family: Raleway;
            font-style: normal;
            font-weight: 800;
            font-size: 69px;
            line-height: 81px;
            margin-bottom: 24px;
            ${screen < 882 ? 'text-align: center;':''}

            /* tosca */

            color: #209FBC;
        }
    }
`)
    
export default Admin