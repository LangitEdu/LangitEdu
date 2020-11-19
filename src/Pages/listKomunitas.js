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
import ModalMember from '../component/Chat/ModalMember';

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
    const [ShowModalMember, setShowModalMember] = useState(false)
    const [DataMember, setDataMember] = useState([])
    const [ListBanUser, setListBanUser] = useState([])
    // const [LoadiedChat, setLoadiedChat] = useState()
    const searchKomunitas = useRef()
    const dummy = useRef()
    const PesanRef = useRef()
    const namaKomunitasRef = useRef()
    const idKomunitasRef = useRef()
    const deskripsiKomunitasRef = useRef()
    const ProfileKomPicRef = useRef()
    const [Loadng, setLoading] = useState(false)


    useEffect(()=>{
        const handleScrollChat = (e)=>{
            let triggerHeight = e.target.scrollTop - e.target.offsetHeight;
            if(1-e.target.scrollHeight >= triggerHeight){
                console.log('udah di puncak',e.target.scrollHeight,triggerHeight);
            }
        }
        document.getElementById('container').addEventListener('scroll', handleScrollChat)
        
        return ()=>{
            if(document.getElementById('container') !== null){
                document.getElementById('container').removeEventListener('scroll',handleScrollChat)
            }
        }
        
    }, [onChat])

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

        db.collection('Komunitas').doc(currentKom).onSnapshot(async(currentKomunitas)=>{
            const currentKomunitasData = currentKomunitas.data()

            setListBanUser(currentKomunitasData.listBanUser)
            setCurrentKomunitas({uid:currentKomunitas.id,...currentKomunitasData, DontRefresh:true})   
            let {photoUrl, nama, id,member} = currentKomunitasData
            document.getElementById('JudulRoom').innerHTML = `${nama} (${member.length}) ` 
            document.getElementById('idRoom').innerHTML = id
            setOnChat(true)
            if(document.getElementById('avaGroup') !== null){
                document.getElementById('avaGroup').src = photoUrl
            }
            await db.collection('Profile').where('uid','in',member).get().then(res=>{
                res.docs.forEach(doc=>{
                    dataMember[doc.id] = doc.data()
                })
                setDataMember(res.docs)
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
        setListKomunitas(<li className="font-weight-bold person tulisan" >Loading....</li>)
        let KomunitasId = searchKomunitas.current.value
        if(KomunitasId.length > 0){
            let docRef = db.collection(`Komunitas`).where('id','==',KomunitasId.toLowerCase())
            setOnSearch(true)
            docRef.get().then((querySnapshot)=>{
                if(querySnapshot.docs.length === 0 ){
                    setListKomunitas(<li className="font-weight-bold person tulisan" >Komunitas yang kamu cari tidak ada :( </li>)
                }else{
                    let newDocs = querySnapshot.docs.filter(doc=>{
                        const data= doc.data()
                        return !data.listBanUser.includes(currentUser.uid)
                    })
                    setListKomunitas(newDocs.map(doc=>{
                        return (
                            <Komunitas  {...doc.data({serverTimestamps: 'estimate'})} key={doc.id} komunitas_uid={doc.id} onClick={joinKomunitas} join={true} />
                        )
                    }))
                }
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
        if(CurrentKomunitas && CurrentKomunitas.member && !CurrentKomunitas.member.includes(currentUser.uid)){
            setOnChat(false)
            document.getElementById('JudulRoom').innerHTML = ""
            document.getElementById('idRoom').innerHTML = ""
        }
        let docRef = db.collection("Komunitas").where("member", "array-contains", currentUser.uid).orderBy("lastChat", "desc")
        let unsub =  docRef.onSnapshot(function(querySnapshot) {
                
                if(onSerach || (CurrentKomunitas && CurrentKomunitas.DontRefresh)){
                    return;
                }

                if(querySnapshot.docs.length === 0 ){
                    setListKomunitas(<li className="person tulisan">Kamu belum mengikuti komunitas apapun</li>)
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
                setListKomunitas(<li className="person tulisan"><span className="font-weight-bold text-danger" >Error X_x</span></li>)
            })
        return unsub
    }, [currentUser,CurrentKomunitas, onSerach])

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
                storage.ref().child(CurrentKomunitas.profileRef).delete().then(()=>{
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
                member : [currentUser.uid],
                listBanUser : []
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
        <Wrapper IsAdmin={IsAdmin}>
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

                        <div className="card bg-transparent m-0">

                            <div className="row no-gutters">
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3">
                                    <div className="users-container">
                                        <div className="chat-search-box">
                                            <form className="input-group align-items-center" onSubmit={handleSearchKomunitas}>
                                                {onSerach && 
                                                <div className="input-group-btn">
                                                    <button type="button" className="btn btn-warning text-white" onClick={cancelSearch} >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                                }
                                                <input ref={searchKomunitas} className="form-control mr-3 py-4" placeholder="Search" onChange={handleSearchTextChange} />
                                                <button type="submit" className="btn btn-info align-self-stretch px-3" id="btnSearch" disabled={!CanSearch}>
                                                    <i className="fa fa-search"></i>
                                                </button>
                                            </form>
                                        </div>
                                        <ul className="users position-relative">
                                            {!onSerach && <li className="tulisan person font-weight-bold"><span>KOMUNITAS DIIKUTI</span></li>}
                                            {ListKomunitas}
                                        </ul>
                                        <button className="btn btn-success tombolBuat m-auto" onClick={()=>{setShowModalAddKomunitas(true);setError()}}>
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className=" card shadow col-xl-8 col-lg-8 col-md-8 col-sm-9 col-9">
                                    <div className="card-body">
                                        <div className="selected-user d-flex justify-content-between flex-wrap align-items-center">
                                            <div className="d-flex">
                                                {onChat && 
                                                CurrentKomunitas &&
                                                <div className="chat-avatar d-none d-lg-block mr-3">
                                                    <img className="img-fluid" src={CurrentKomunitas.photoUrl} alt="Profile Komunitas" id="avaGroup"/>
                                                </div>
                                                }
                                                <div className="d-flex flex-column mt-lg-4" onClick={()=>{
                                                    if(onChat && IsAdmin){
                                                        setShowModalMember(true)
                                                    }
                                                }} >
                                                    <span className="name mb-1" id="JudulRoom"></span>
                                                    <span className="idRoom" id="idRoom"></span>
                                                </div>
                                            </div>
                                            <div>
                                            {onChat && 
                                            <>
                                                {IsAdmin && 
                                                    <button className="tombol shadow-sm btn-bordered mr-4" onClick={()=>{setShowModalEditKomunitas(true)}}>
                                                        Edit 
                                                    </button>
                                                }
                                            <button className="tombol shadow-sm btn-bordered-red" onClick={handleExitGroup}>
                                                Exit
                                                </button>
                                            </>
                                            }
                                            </div>
                                        </div>
                                        <div className="chat-container">
                                            <ul id="container" className="chat-box chatContainerScroll d-flex flex-column-reverse justify-content-start">
                                                <li ref={dummy}></li>
                                                {
                                                onChat ? 
                                                Chat
                                                :
                                                <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
                                                    <img className="img-fluid mb-4" src="/img/Icon-chat.png" alt="chat"/>
                                                    <span className="text-black-50 font-weight-bold mb-5" >Pilih komunitas terlebih dahulu untuk memulai diskusi</span>
                                                </div>
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
                                                    <button type="submit" className="btn btn-primary btn-block" disabled={!chatAble} >Kirim</button>
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
        </div>

        {ShowModalMember &&
        <ModalMember
        hideModal={()=>{setShowModalMember(false)}}
        dataMember={DataMember}
        currentUser={currentUser}
        CurrentKomunitas = {CurrentKomunitas}
        ListBanUser={ListBanUser}
        />
        }
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

const Wrapper = Styled.div(({IsAdmin}) =>`
body{
    background : white;
}

#JudulRoom{
    ${IsAdmin? 'cursor: pointer' : '' }
}

.card .card{
    border-radius:2rem;
}

.modal{
    z-index: 9999;
}
.selected-user .chat-avatar {
    overflow: hidden;
    border-radius: 130%;
    position: relative;
    width: 70px;
    margin: 10px;
}
.selected-user .idRoom{
    font-weight: 400;
}
#JudulRoom{
    font-size: 1.3rem;
}
.overflow{
    width: 100vw;
    height: 100vh;
    background: #0000004d;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 999;
}
.chat-search-box {
    -webkit-border-radius: 3px 0 0 0;
    -moz-border-radius: 3px 0 0 0;
    border-radius: 3px 0 0 0;
    padding: .75rem 1rem;
}

button#btnSearch, .chat-search-box .input-group .form-control {
    border-radius: .75rem;
}

@media (max-width: 767px) {
    .chat-search-box {
        display: none;
    }
}

.users-container {
    position: relative;
    padding: 1rem 0;
    height: 100%;
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;
}

.users {
    padding: 0;
}

.users .person {
    position: relative;
    width: 100%;
    padding: 10px 1rem;
    cursor: pointer;
    border-bottom: 1px solid #f0f4f8;
}

.users .person.tulisan{
    border-bottom: none !important;
    cursor: auto;
}

.users .person:hover {
    background-color: #ffffff;
    /* Fallback Color */
    background-image: -webkit-gradient(linear, left top, left bottom, from(#e9eff5), to(#ffffff));
    /* Saf4+, Chrome */
    background-image: -webkit-linear-gradient(right, #e9eff5, #ffffff);
    /* Chrome 10+, Saf5.1+, iOS 5+ */
    background-image: -moz-linear-gradient(right, #e9eff5, #ffffff);
    /* FF3.6 */
    background-image: -ms-linear-gradient(right, #e9eff5, #ffffff);
    /* IE10 */
    background-image: -o-linear-gradient(right, #e9eff5, #ffffff);
    /* Opera 11.10+ */
    background-image: linear-gradient(right, #e9eff5, #ffffff);
}

.users .person.active-user {
    background-color: #ffffff;
    /* Fallback Color */
    background-image: -webkit-gradient(linear, left top, left bottom, from(#f7f9fb), to(#ffffff));
    /* Saf4+, Chrome */
    background-image: -webkit-linear-gradient(right, #f7f9fb, #ffffff);
    /* Chrome 10+, Saf5.1+, iOS 5+ */
    background-image: -moz-linear-gradient(right, #f7f9fb, #ffffff);
    /* FF3.6 */
    background-image: -ms-linear-gradient(right, #f7f9fb, #ffffff);
    /* IE10 */
    background-image: -o-linear-gradient(right, #f7f9fb, #ffffff);
    /* Opera 11.10+ */
    background-image: linear-gradient(right, #f7f9fb, #ffffff);
}

.users .person:last-child {
    border-bottom: 0;
}

.users .person .user {
    display: inline-block;
    position: relative;
    margin-right: 10px;
}

.users .person .user img {
    width: 48px;
    height: 48px;
    -webkit-border-radius: 50px;
    -moz-border-radius: 50px;
    border-radius: 50px;
}

.users .person .user .status {
    width: 10px;
    height: 10px;
    -webkit-border-radius: 100px;
    -moz-border-radius: 100px;
    border-radius: 100px;
    background: #e6ecf3;
    position: absolute;
    top: 0;
    right: 0;
}

.users .person .user .status.online {
    background: #9ec94a;
}

.users .person .user .status.offline {
    background: #c4d2e2;
}

.users .person .user .status.away {
    background: #f9be52;
}

.users .person .user .status.busy {
    background: #fd7274;
}

.users .person p.name-time {
    font-weight: 600;
    font-size: .85rem;
    display: inline-block;
}

.users .person p.name-time .time {
    font-weight: 400;
    font-size: .7rem;
    text-align: right;
    color: #8796af;
}

@media (max-width: 767px) {
    .users .person .user img {
        width: 30px;
        height: 30px;
    }
    .users .person p.name-time {
        display: none;
    }
    .users .person p.name-time .time {
        display: none;
    }
}

.selected-user {
    width: 100%;
    padding: 0 15px;
    min-height: 64px;
    line-height: 64px;
    border-radius: 0 3px 0 0;
}

.selected-user span {
    line-height: 100%;
}

.selected-user span.name {
    font-weight: 700;
}

.chat-container {
    position: relative;
    padding: 1rem;
    
}
.chat-container ul{
    height: 70vh;
    overflow: auto;
}

.chat-container li.chat-left,
.chat-container li.chat-right {
    display: flex;
    flex-direction: row;
    margin-bottom: 40px;
}

.chat-container li img {
    width: 48px;
    height: 48px;
    -webkit-border-radius: 30px;
    -moz-border-radius: 30px;
    border-radius: 30px;
}

.chat-container li .chat-avatar {
    margin-right: 20px;
}

.chat-container li.chat-right {
    justify-content: flex-start;
}

.chat-container li.chat-right > div .chat-avatar {
    margin-left: 20px;
    margin-right: 0;
}

.chat-container li div .chat-name {
    text-align: left;
}

.chat-container li.chat-right > div .chat-name {
    text-align: right;
}
.chat-container li.chat-right > div div .chat-text {
    float: right;
}
.chat-container li .chat-name {
    font-size: .75rem;
    color: #999999;
    text-align: center;
}

.chat-container li .chat-text {
    padding: .5rem 1rem;
    border-radius: 4px;
    background: #f1f1f1;
    font-weight: 300;
    position: relative;
    width: fit-content;
}

.chat-container li.chat-right > div .chat-text {
    background : #007A95;
    color: #FBFBFB;
}

.tombol{
    padding : .4rem 2rem ;
}

.tombolBuat {
    position: absolute;
    bottom: 30px;
    left: 40px;
    border-radius: 100%;
    padding: 14px 20px;
}

.chat-container li .chat-text:before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    top: 10px;
    left: -20px;
    border: 10px solid;
    border-color: transparent #f1f1f1 transparent transparent;
}

.chat-container li.chat-right > div .chat-text:before {
    right: -20px;
    border-color: transparent transparent transparent #007A95;
    left: inherit;
}

.chat-container li .chat-hour {
    padding: 0;
    margin-bottom: 10px;
    font-size: .75rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 0 0 0 15px;
}

.chat-container li .chat-hour > span {
    font-size: 16px;
    color: #9ec94a;
}

.chat-container li.chat-right > .chat-hour {
    margin: 0 15px 0 0;
}

@media (max-width: 767px) {
    .chat-container li.chat-left,
    .chat-container li.chat-right {
        flex-direction: column;
        margin-bottom: 30px;
    }
    .chat-container li img {
        width: 32px;
        height: 32px;
    }
    .chat-container li.chat-left .chat-avatar {
        margin: 0 0 5px 0;
        display: flex;
        align-items: center;
    }
    .chat-container li.chat-left .chat-hour {
        justify-content: flex-end;
    }
    .chat-container li.chat-left .chat-name {
        margin-left: 5px;
    }
    .chat-container li.chat-right .chat-avatar {
        order: -1;
        margin: 0 0 5px 0;
        align-items: center;
        display: flex;
        justify-content: right;
        flex-direction: row-reverse;
    }
    .chat-container li.chat-right .chat-hour {
        justify-content: flex-start;
        order: 2;
    }
    .chat-container li.chat-right div .chat-name {
        margin-right: 5px;
    }
    .chat-container li .chat-text {
        font-size: .8rem;
    }
}

.chat-form {
    padding: 15px;
    width: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ffffff;
    border-top: 1px solid white;
}

ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
}
.card {
    border: 0;
    border-radius: 2px;
    margin-bottom: 2rem;
    box-shadow: none;
}
`)