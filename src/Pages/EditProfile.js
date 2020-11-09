import React, { useEffect, useRef, useState } from 'react'
import {useAuth} from '../contexts/AuthContext'
import {storage, EmailAuthProvider} from '../config/Firebase'
import Navbar from '../component/Navbar/Navbar'

export default function EditProfile() {
    const {currentUser} = useAuth()
    const passwordRef = useRef('')
    const namaRef = useRef('')
    const emailRef = useRef('')
    const profilePicRef = useRef('')
    const [Loading, setLoading] = useState(false)
    const [newError, setError] = useState(false)
    const [Sukses, setSukses] = useState('')
    const reAuth = async (e)=>{
        e.preventDefault()
        setLoading(true)
        setError(false)
        let promise = []
        let userdata = {
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
        }
        let gantiDisplayName = false
        let gantiProfilePic = false
        const credential = EmailAuthProvider.credential(currentUser.email, passwordRef.current.value)
        try{
            await currentUser.reauthenticateWithCredential(credential).catch(function(error) {
                setError(error)
                setLoading(false)
                throw new Error(error)
            });
        }catch(err){
            console.log(err);
            return
        }
        const changeEmail = async()=>{
            currentUser.updateEmail(emailRef.current.value).then(function() {
                currentUser.sendEmailVerification()
            }).catch(function(error) {
                setError(error);
                throw new Error(error)
            });
        }

        const updateProfile = async (gantiProfilePic, gantiDisplayName)=>{
            if(gantiProfilePic){
                userdata.photoURL = await uploadProfilePic(profilePicRef.current.files[0])
            }
            if(gantiDisplayName){
                userdata.displayName = namaRef.current.value
            }
            await currentUser.updateProfile(userdata)
                    .catch(function(error) {
                        setError(error);
                        throw new Error(error)
                    });
        }
        const uploadProfilePic = async(file)=>{
            let extention = file.name.split('.').pop();
            let res = await storage.ref('ProfilePic')
                    .child(currentUser.uid+extention).put(file)
            let url = res.ref.getDownloadURL()
            return url
        }
        if(emailRef.current.value !== currentUser.email){
            const credential = {
                email : currentUser.email,
                password : passwordRef.current.value
            }
            promise.push(changeEmail(credential))
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
            passwordRef.current.value = ''
            setLoading(false)
        }).catch(err=>{
            setLoading(false)
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
        if(e.target.files.length > 0){
            let name
            const file = e.target.files[0]
            if(file.name.length < 40){
                name = file.name
            }else{
                name = file.name.substring(0,20)+"...."
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
        <>
        <Navbar />
        <div className="container mt-4">
            <h1>Edit Profile</h1>
            {newError && 
            <div className="alert alert-danger">
                {newError.message}
            </div>
            }
            {Sukses && 
            <div className="alert alert-success">
                {Sukses.message}
            </div>
            }
            <div className="card">
                <div className="card-body">
                    <form onSubmit={reAuth}>
                        <div className="profilpic mb-4" style={{maxWidth:'10rem',maxHeight:'10rem',overflow:'hidden',borderRadius:"100%"}}>
                            <img id="profilepic" src={currentUser.photoURL} alt="Profile" className="img-fluid"/>
                        </div>
                        <div className="form-group">
                            <div className="custom-file">
                                <input ref={profilePicRef} type="file" className="custom-file-input" id="newProfilePic" onChange={handleProfileChange} accept=".png,.jpg,.jpeg"/>
                                <label id="labelNewProfilePic" className="custom-file-label" htmlFor="newProfilePic">Choose file</label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="nama">Nama</label>
                            <input ref={namaRef} type="text" className="form-control" defaultValue={currentUser.displayName} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nama">E-mail</label>
                            <input ref={emailRef} type="text" className="form-control" defaultValue={currentUser.email} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nama">Password</label>
                            <input ref={passwordRef} type="password" className="form-control"/>
                        </div>
                        <button id="btnSubmit" className="btn btn-primary" type="submit" disabled={Loading}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}
