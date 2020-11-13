// Starter
import React, { useEffect, useRef, useState } from 'react'
import { db, FieldValue, storage } from '../config/Firebase';
import {useAuth} from '../contexts/AuthContext'

// Komponen
import ChatBubble from '../component/Chat/ChatBubble';
import Komunitas from '../component/Chat/Komunitas';
import ModalKomunitas from '../component/Chat/ModalKomunitas';
import Navbar from '../component/Navbar/Navbar'
import RichForm from '../component/Chat/RichForm';
import ModalEditKomunitas from '../component/Chat/ModalEditKomunitas';

// Head
import { Helmet } from 'react-helmet';

// CSS
import Styled from '@emotion/styled'
import { ChatCSS } from '../component/Chat/ChatCSS';

export default function ListKomunitas() {

    const [Error, setError] = useState(false)
    const {currentUser, IsAdmin} = useAuth()
    const [ListKomunitas, setListKomunitas] = useState("Loading...")
    const [bakcupListKomunitas, setBakcupListKomunitas] = useState()
    const [Chat, setChat] = useState('Loading...')
    const [onChat, setOnChat] = useState(false)
    const [chatAble, setChatAble] = useState(false)
    const [pesan, setPesan] = useState('')
    const [CurrentKomunitas, setCurrentKomunitas] = useState()
    const [onSerach, setOnSearch] = useState(false)
    const [CanSearch, setCanSearch] = useState(false)
    const [ShowModalAddKomunitas, setShowModalAddKomunitas] = useState(false)
    const [ShowModalEditKomunitas, setShowModalEditKomunitas] = useState(false)
    const searchKomunitas = useRef()
    const dummy = useRef()
    const PesanRef = useRef()
    
    const namaKomunitasRef = useRef()
    const idKomunitasRef = useRef()
    const deskripsiKomunitasRef = useRef()
    const ProfileKomPicRef = useRef()
    const [Loadng, setLoading] = useState(false)

    async function LiatChat(e, langsungUID=false, komUid=null){
        setChat("loding..")
        document.getElementById('idRoom').innerHTML = "Loading..."
        document.getElementById('JudulRoom').innerHTML = "Loading..."
        searchKomunitas.current.value = ""
        let dataMember = []
        function getKomunitasUID(target) {
            let currentKom;
            if(target.dataset.chat === undefined){
                currentKom = getKomunitasUID(target.parentNode)
            }else{
                currentKom = target.dataset.chat
            }
    
            return currentKom;
        }
        let currentKom = langsungUID ? komUid : getKomunitasUID(e.target)
        const currentKomunitas = await db.collection('Komunitas').doc(currentKom).get()
        const currentKomunitasData = currentKomunitas.data()
        setCurrentKomunitas({uid:currentKomunitas.id,...currentKomunitasData})   
        let {photoUrl, nama, id,member} = currentKomunitasData
        document.getElementById('JudulRoom').innerHTML = nama
        document.getElementById('idRoom').innerHTML = id
        setOnChat(true)
        document.getElementById('avaGroup').src = photoUrl
        await db.collection('Profile').where('uid','in',member).get().then(res=>{
            res.forEach(doc=>{
                dataMember[doc.id] = doc.data()
            })
            let docRef = db.collection(`Komunitas`).doc(currentKom).collection("Pesan").orderBy("timestamp", "desc")
            docRef.onSnapshot((querySnapshot)=>{
                if(!querySnapshot.empty){
                    setChat(querySnapshot.docs.map((doc)=>{
                        return <ChatBubble {...doc.data({serverTimestamps: 'estimate'})} 
                                    docid={doc.id} 
                                    komuniastUID={currentKom} 
                                    dataMember={dataMember[doc.data().sender_uid]} 
                                    key={doc.id} />
                    }))
                }else{
                    setChat("Masih belum ada pesan dari room")
                }
                
            },(err)=>{
                console.log(err);
            })
        })

    }

    function handleFormPesan(e) {
        setPesan(e)
        if(e.length>0){
            setChatAble(true)
        }else{
            setChatAble(false)
        }
    }

    async function kirimPesan(e) {
        let currentKomunitasUID;
        if(!e.komunitasUID){
            e.preventDefault();
        }
        currentKomunitasUID = CurrentKomunitas ? CurrentKomunitas.uid : e.KomunitasUID
        setError('')
        if(PesanRef.current.value.length > 0){
            const PesanYangDikirim = PesanRef.current.value
            setPesan('')
            const patt = /((<script.*?>|<script>).*?<\/script>)/
            if(patt.test(PesanYangDikirim)){
                setError('Dilarang Mengirimkan script text')
                return;
            }
            
            await db.collection('Komunitas').doc(currentKomunitasUID).collection('Pesan').add({
                sender_uid: currentUser.uid,
                timestamp: FieldValue.serverTimestamp(),
                body:PesanYangDikirim
              });
            
            dummy.current.scrollIntoView({behavior : 'smooth'})
            db.collection('Komunitas').doc(currentKomunitasUID).update({
                lastChat: FieldValue.serverTimestamp()
            })
        }
    }
    async function joinKomunitas(e) {
        e.preventDefault();
        function getKomunitasUID(target) {
            let komunitasUID;
            if(target.dataset.chat === undefined){
                komunitasUID = getKomunitasUID(target.parentNode)
            }else{
                komunitasUID = target.dataset.chat
            }
            return komunitasUID;
        }
        let NewkomunitasUID = getKomunitasUID(e.target)
        setCurrentKomunitas({uid:NewkomunitasUID})
        setChat("Loading....")
        setOnChat(true)
        cancelSearch()
        await db.collection('Komunitas').doc(NewkomunitasUID).update({
            member: FieldValue.arrayUnion(currentUser.uid)
        })
        .then(async () => {
            await db.collection('Profile').doc(currentUser.uid).update({
                komunitas: FieldValue.arrayUnion(NewkomunitasUID)
            }).then(() => {
                LiatChat(e,true,NewkomunitasUID)
            }).catch((err) => {
                console.log(err);
                return;
            });
        }).catch((err) => {
            console.log(err);
            return ;
        });
        
    }

    async function handleExitGroup(){
        await db.collection('Komunitas').doc(CurrentKomunitas.uid).update({
            member: FieldValue.arrayRemove(currentUser.uid)
        })
        .then(async () => {
            let currentKom = await db.collection('Komunitas').doc(CurrentKomunitas.uid).get()
            const data = currentKom.data()
            if(data.member.length === 0){

                if(data.profileRef){
                    storage.ref().child(data.profileRef).then(res=>{
                        console.log('berhasil menghapus foto profile');
                    }).catch(err=>{
                        console.log(err);
                    })
                }

                db.collection('Komunitas').doc(CurrentKomunitas.uid).delete()
                .then(()=>{
                    console.log("Berhasil menghapus");
                }).catch((err)=>{
                    console.log(err);
                })
            }
            await db.collection('Profile').doc(currentUser.uid).update({
                komunitas: FieldValue.arrayRemove(CurrentKomunitas.uid)
            }).then(() => {
                setOnChat(false)
                document.getElementById('JudulRoom').innerHTML = ""
                document.getElementById('idRoom').innerHTML = ""
            }).catch((err) => {
                console.log(err);
                return;
            });
        }).catch((err) => {
            console.log(err);
            return ;
        });

    }
    async function handleSearchTextChange(){
        if(searchKomunitas.current.value.length > 0){
            setCanSearch(true)
        }else{
            setCanSearch(false)
            cancelSearch()
        }
    }
    async function handleSearchKomunitas(e){
        e.preventDefault()
        setListKomunitas("Loading....")
        let KomunitasId = searchKomunitas.current.value
        if(KomunitasId.length > 0){
            let docRef = db.collection(`Komunitas`).where('id','==',KomunitasId.toLowerCase())
            setOnSearch(true)
            docRef.get().then((querySnapshot)=>{
                if(querySnapshot.docs.length === 0 ){
                    setListKomunitas("Komunitas yang km cari tidak ada")
                    return;
                }
                setListKomunitas(querySnapshot.docs.map(doc=>{
                    return (
                        <Komunitas  {...doc.data({serverTimestamps: 'estimate'})} key={doc.id} komunitas_uid={doc.id} onClick={joinKomunitas} join={true} />
                    )
                }))
            })
        }
        return ;
    }
    function cancelSearch() {
        searchKomunitas.current.value = ''
        setOnSearch(false)
        setListKomunitas(bakcupListKomunitas)
    }
    useEffect(() => {
        let docRef = db.collection("Komunitas").where("member", "array-contains", currentUser.uid).orderBy("lastChat", "desc")
        let unsub =  docRef.onSnapshot(function(querySnapshot) {
                if(querySnapshot.docs.length === 0 ){
                    setListKomunitas("Belum ada obrolan")
                    return;
                }
                let listKomunitas = querySnapshot.docs.map(doc=>{
                    const data = doc.data({serverTimestamps: 'estimate'})
                    if(CurrentKomunitas && CurrentKomunitas.uid === doc.id){
                        setCurrentKomunitas({...data,uid:doc.id})
                    }
                    return (
                        <Komunitas  {...data} key={doc.id} komunitas_uid={doc.id} onClick={LiatChat} />
                    )
                })
                setListKomunitas(listKomunitas)
                setBakcupListKomunitas(listKomunitas)
            },(err)=>{
                console.log(err);
                setListKomunitas("Error X_x")
            })
        return unsub
    }, [currentUser,CurrentKomunitas])

    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }


    async function EditKomunitas(e){
        e.preventDefault()
        setError()
        setLoading(true)
        let KomProfilePicUrl ;
        let file;
        let extention;
        let FileUID;
        if(ProfileKomPicRef.current.files.length >0){
            console.log('update profile pic');
            if(CurrentKomunitas.profileRef){
                storage.ref().child(CurrentKomunitas.profileRef).then(()=>{
                    console.log('berhasil menghapus foto profile');
                }).catch(err=>{
                    console.log(err);
                })
            }
            file = ProfileKomPicRef.current.files[0]
            extention = file.name.split('.').pop();
            FileUID = makeid(20)
            await storage.ref('Komunitas').child(FileUID+"."+extention).put(file)
                        .then((res)=>{
                            return res.ref.getDownloadURL()
                        })
                        .then(res=>{
                            console.log(res);
                            KomProfilePicUrl = res
                        })
                        .catch(err=>{
                            setError(err)
                            return;
                        })
        }
        let data = {
            deskripsi: deskripsiKomunitasRef.current.value,
            id: '@'+idKomunitasRef.current.value.toLowerCase(),
            lastChat : FieldValue.serverTimestamp(),
            nama:namaKomunitasRef.current.value,
        }
        if(KomProfilePicUrl){
            data.photoUrl = KomProfilePicUrl
            data.profileRef = 'Komunitas/'+FileUID+"."+extention

        }

        document.getElementById('JudulRoom').innerHTML = data.nama
        document.getElementById('idRoom').innerHTML = data.id

        return await db.collection('Komunitas').doc(CurrentKomunitas.uid).update(data)
        .then((res)=>{
            console.log('Berhasil update', res);
            setLoading(false)
            setShowModalEditKomunitas(false)
            return;
        })
        .catch(err=>{
            setError(err)
            setShowModalEditKomunitas(false)
            return;
        })
    }
    
    async function AddKomunitas(e) {
        e.preventDefault()
        setError()
        setLoading(true)
        let idKomunitas = idKomunitasRef.current.value
        let namaKomunitas = namaKomunitasRef.current.value
        let dekskripsiKomunitas = deskripsiKomunitasRef.current.value
        
        // Data ga boleh kosong
        if(idKomunitas.length <= 0 || namaKomunitas.length <=0){
            setError("Data tidak boleh ada yang kosong")
            setShowModalAddKomunitas(false)
            setLoading(false)
            return;
        }

        let checkId = await db.collection("Komunitas").where("id", "==", '@'+idKomunitas.toLowerCase()).get()
        if(checkId.empty){
            let KomProfilePicUrl ;
            let file;
            let extention;
            let FileUID;
            if(ProfileKomPicRef.current.files.length > 0){
                file = ProfileKomPicRef.current.files[0]
                extention = file.name.split('.').pop();
                FileUID = makeid(20)
                await storage.ref('Komunitas').child(FileUID+"."+extention).put(file)
                            .then((res)=>{
                                return res.ref.getDownloadURL()
                            })
                            .then(res=>{
                                console.log(res);
                                KomProfilePicUrl = res
                            })
                            .catch(err=>{
                                setError(err)
                                return;
                            })
                
            }
            let data = {
                deskripsi: dekskripsiKomunitas,
                id: '@'+idKomunitas.toLowerCase(),
                lastChat : FieldValue.serverTimestamp(),
                nama:namaKomunitas,
                photoUrl : KomProfilePicUrl ? KomProfilePicUrl : `https://avatars.dicebear.com/api/identicon/${new Date().getTime()}.svg`,
                member : [currentUser.uid]
            }
            if(KomProfilePicUrl){
                data.profileRef = 'Komunitas/'+FileUID+"."+extention
            }
            await db.collection("Komunitas").add(data).catch(err=>{
                setError(err)
                setShowModalAddKomunitas(false)
                setLoading(false)
                return
            })

        }else{
            console.log("udah ga bisa");
            setError("id komunitas sudah dipakai")
            setShowModalAddKomunitas(false)
            setLoading(false)
            return
        }
        setShowModalAddKomunitas(false)
        setLoading(false)
    }  
    return (
        <Wrapper>
        <Navbar />
        <Helmet>
            <title>Komunitas | Langit Edu</title>
        </Helmet>
        <div className="container mt-5">
            {Error &&
                <div className="alert alert-danger">
                {Error}
                </div>
            }
            <div className="content-wrapper">

                <div className="row gutters">

                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">

                        <div className="card m-0">

                            <div className="row no-gutters">
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3">
                                    <div className="users-container">
                                        <div className="chat-search-box">
                                            <form className="input-group" onSubmit={handleSearchKomunitas}>
                                                {onSerach && 
                                                <div className="input-group-btn">
                                                    <button type="button" className="btn btn-warning text-white" onClick={cancelSearch} >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                                }
                                                <input ref={searchKomunitas} className="form-control" placeholder="Search" onChange={handleSearchTextChange} />
                                                <div className="input-group-btn">
                                                    <button type="submit" className="btn btn-info" id="btnSearch" disabled={!CanSearch}>
                                                        <i className="fa fa-search"></i>
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                        <ul className="users position-relative">
                                            {ListKomunitas}
                                        </ul>
                                        <button className="btn btn-success tombolBuat m-auto" onClick={()=>{setShowModalAddKomunitas(true);setError()}}>
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-9 col-9">
                                    <div className="selected-user d-flex justify-content-between flex-wrap align-items-center">
                                        <div className="d-flex">
                                            {onChat && 
                                            CurrentKomunitas &&
                                            <div className="chat-avatar d-none d-lg-block mr-3">
                                                <img className="img-fluid" src={CurrentKomunitas.photoUrl} alt="Profile Komunitas" id="avaGroup"/>
                                            </div>
                                            }
                                            <div className="d-flex flex-column mt-lg-4">
                                                <span className="name mb-1" id="JudulRoom"></span>
                                                <span className="idRoom" id="idRoom"></span>
                                            </div>
                                        </div>
                                        <div>
                                        {onChat && 
                                        <>
                                            {IsAdmin && 
                                                <button className="btn btn-info mr-4" onClick={()=>{setShowModalEditKomunitas(true)}}>
                                                    Edit <i className="far fa-edit" style={{fontSize:".8rem"}}></i>
                                                </button>
                                            }
                                        <button className="btn btn-danger" onClick={handleExitGroup}>
                                            Exit <i className="fas fa-external-link-alt" style={{fontSize:".8rem"}}></i>
                                            </button>
                                        </>
                                        }
                                        </div>
                                    </div>
                                    <div className="chat-container">
                                        <ul className="chat-box chatContainerScroll d-flex flex-column-reverse justify-content-start">
                                            <li ref={dummy}></li>
                                            {
                                            onChat ? 
                                            Chat
                                            :
                                            "Selamat Datang"
                                            }
                                        </ul>
                                        {onChat &&
                                            <>
                                            <form onSubmit={(kirimPesan)} id="formPesan">
                                                <div className="">
                                                <RichForm 
                                                    reference={PesanRef}
                                                    pesan={pesan}
                                                    onEditorChange={handleFormPesan}
                                                    kirimPesan={kirimPesan}
                                                    KomunitasUID={CurrentKomunitas.uid}
                                                />
                                                <button type="submit" className="btn btn-primary" disabled={!chatAble} >Kirim</button>
                                                </div>
                                            </form>
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
        {ShowModalEditKomunitas && 
            <ModalEditKomunitas 
                    onClick={()=>{setShowModalEditKomunitas(false)}}
                    onSubmit={EditKomunitas}
                    namaKomunitasRef={namaKomunitasRef}
                    idKomunitasRef = {idKomunitasRef}
                    deskripsiKomunitasRef={deskripsiKomunitasRef}
                    ProfileKomPicRef={ProfileKomPicRef}
                    Loading={Loadng}
                    defaultValue={CurrentKomunitas}
            /> 
        }
        {ShowModalAddKomunitas && 
        <ModalKomunitas 
                onClick={()=>{setShowModalAddKomunitas(false)}}
                onSubmit={AddKomunitas}
                namaKomunitasRef={namaKomunitasRef}
                idKomunitasRef = {idKomunitasRef}
                deskripsiKomunitasRef={deskripsiKomunitasRef}
                ProfileKomPicRef={ProfileKomPicRef}
                Loading={Loadng}
        /> 
        }
    </Wrapper>
    )
}

const Wrapper = Styled.div(() =>ChatCSS)