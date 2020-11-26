import React, { useEffect, useRef, useState } from 'react'
import {useAuth} from '../contexts/AuthContext'
import {storage, db} from '../config/Firebase'
import Navbar from '../component/Navbar/Navbar'
import FormGroup from '../component/EditProfile/FormGroup'
import styled from '@emotion/styled'
import FooterCopyright from '../component/FooterCopyright'
import { Helmet } from 'react-helmet'

export default function EditProfile() {
    const {currentUser} = useAuth()
    const namaRef = useRef('')
    const profilePicRef = useRef('')
    const [Loading, setLoading] = useState(false)
    const [newError, setError] = useState(false)
    const [Sukses, setSukses] = useState(false)
    let FormGroupArr = [
        {
            label:'Nama',
            refer: namaRef,
            defaultValue:currentUser.displayName,
        },
    ]
    FormGroupArr = FormGroupArr.map((data,i)=>{
        return <FormGroup {...data} key={i} />
    })
    const reAuth = async (e)=>{
        e.preventDefault()
        setLoading(true)
        setError(false)
        setSukses(false)
        let promise = []
        let userdata = {
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
        }
        let gantiDisplayName = false
        let gantiProfilePic = false
        const updateProfile = async (gantiProfilePic, gantiDisplayName)=>{
            if(gantiProfilePic){
                const user  = await db.collection('Profile').doc(currentUser.uid).get()
                if(user.data().profileRef){
                    storage.ref().child(user.data().profileRef).delete().catch(err=>{
                        setError(err)
                        return ;
                    })
                }
                const {url, ref} = await uploadProfilePic(profilePicRef.current.files[0])
                userdata.photoURL = await url
                userdata.profileRef = ref
            }
            if(gantiDisplayName){
                userdata.displayName = namaRef.current.value
            }
            await db.collection('Profile').doc(currentUser.uid).update(userdata)
            .catch(function(error) {
                setError(error);
                throw new Error(error.message)
              });
            currentUser.updateProfile(userdata)
            .catch(function(error) {
                setError(error);
                throw new Error(error.message)
              });
        }
        const uploadProfilePic = async(file)=>{
            let extention = file.name.split('.').pop();
            let url = await storage.ref('ProfilePic')
                    .child(currentUser.uid+"."+extention).put(file)
                    .then(async(res)=>{
                        return await res.ref.getDownloadURL()
                    })
                    .catch(function(error) {
                        setError(error);
                        throw new Error(error.message)
                      });
            return {url:url, ref:'ProfilePic/'+currentUser.uid+"."+extention}
        }
        if(profilePicRef.current.files.length > 0){
            gantiProfilePic = true
        }
        if(namaRef.current.value !== currentUser.displayName){
            gantiDisplayName = true
        }
        if(gantiDisplayName || gantiProfilePic){
            promise.push(updateProfile(gantiProfilePic,gantiDisplayName))
        }
        Promise.all(promise).then(()=>{
            setSukses({message:'Berhasil mengupdate Profile'})
            setLoading(false)
        })
        .catch(err=>{
            setLoading(false)
            console.log(err);
            setError(err);
        })
    }

    useEffect(() => {
        if (Loading) {
            document.getElementById('btnSubmit').innerHTML = `Loading..`
        }else{
            document.getElementById('labelNewProfilePic').innerHTML = 'Choose file'
            document.getElementById('btnSubmit').innerHTML = `Submit`
        }
    }, [Loading])

    const handleProfileChange = (e)=>{
        setError()
        if(e.target.files.length > 0){
            let name
            const file = e.target.files[0]
            const AcceptAbleExtention = ['png','jpeg','jpg']
            let extention = file.name.split('.').pop();
            if(!AcceptAbleExtention.includes(extention.toLowerCase())){
                setError({message:"anda mengupload file dengan ekstensi yang tidak diizinkan, silahkan upload file yang lain"});
                document.getElementById('profilepic').src = currentUser.photoURL
                return;
            }
            if(file.size > 5242880){
                setError({message:'Ukuran file yang anda upload terlalu besar, harap upload file yang berukuran tidak lebih dari 5MB'})
                document.getElementById('profilepic').src = currentUser.photoURL
                return
            }
            
            if(file.name.length < 40){
                name = file.name
            }else{
                name = file.name.substring(0,40)+"...."
            }
            var reader = new FileReader();
    
            reader.onload = function(e) {
                document.getElementById('profilepic').src = e.target.result
            }
            reader.readAsDataURL(file);
            document.getElementById('labelNewProfilePic').innerHTML = name
        }else{
            document.getElementById('profilepic').src = currentUser.photoURL
            document.getElementById('labelNewProfilePic').innerHTML = 'Choose file'
        }
    }

    return (
        <Wrapper>
        <Helmet>
            <title>Ubah Profile | Langit Edu</title>
        </Helmet>
        <Navbar />
        <div className="container my-4 vh-100">
            <h1 className="mb-1">Edit Profile</h1>
            <hr className="mb-3"/>
            {newError && 
            <div className="alert alert-danger mb-4">
                {newError.message}
            </div>
            }
            {Sukses && 
            <div className="alert alert-success mb-4">
                {Sukses.message}
            </div>
            }
            <div className="card">
                <div className="card-body py-5">
                    <div className="row">
                        <div className="col-md-3 d-flex justify-content-center">
                            <div className="profilpic mb-4" style={{width:'10rem',maxHeight:'10rem',overflow:'hidden',borderRadius:"100%"}}>
                                <img id="profilepic" src={currentUser.photoURL} alt="Profile"/>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <form onSubmit={reAuth}>
                                <div className="form-group">
                                    <div className="custom-file">
                                        <input ref={profilePicRef} type="file" className="custom-file-input" id="newProfilePic" onChange={handleProfileChange} accept=".png,.jpg,.jpeg"/>
                                        <label id="labelNewProfilePic" className="custom-file-label" htmlFor="newProfilePic">Choose file</label>
                                    </div>
                                </div>
                                {FormGroupArr}
                                <button id="btnSubmit" className="btn btn-primary btn-block" type="submit" disabled={Loading || newError}>Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="mt-5">
            <FooterCopyright />
        </div>
        </Wrapper>
    )
}

const Wrapper = styled.div(()=>`

#profilepic{
    width:100%;
    object-fit: cover;
}
h1{
    color: #209FBC;
    font-size: 4rem;
}
.card{
    border:none;
    border-radius:2rem;
    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.25);
}
`)
