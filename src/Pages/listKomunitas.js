import React, { useEffect, useRef, useState } from 'react'
import ChatBubble from '../component/Chat/ChatBubble';
import Komunitas from '../component/Chat/Komunitas';
import NavbarUser from '../component/Navbar/NavbarUser'
import { db, FieldValue } from '../config/Firebase';
import {useAuth} from '../contexts/AuthContext'

export default function ListKomunitas() {
    const {currentUser} = useAuth()
    const [ListKomunitas, setListKomunitas] = useState("Loading...")
    const [Chat, setChat] = useState('Loading...')
    const [onChat, setOnChat] = useState(false)
    const [chatAble, setChatAble] = useState(false)
    const [pesan, setPesan] = useState()
    const [komunitasUID, setKomunitasUID] = useState()
    const searchKomunitas = useRef()
    const dummy = useRef()
    const PesanRef = useRef()

    async function LiatChat(e, langsungUID=false, komUid=null){
        setOnChat(true)
        setChat("loding..")
        searchKomunitas.current.value = ""
        function getKomunitasUID(target) {
            let komuniastUID;
            if(target.dataset.chat === undefined){
                komuniastUID = getKomunitasUID(target.parentNode)
            }else{
                komuniastUID = target.dataset.chat
            }
    
            return komuniastUID;
        }
        let komuniastUID = langsungUID ? komUid : getKomunitasUID(e.target)
        setKomunitasUID(komuniastUID)
        let namaKomunitas = document.getElementById(`namaRoom_${komuniastUID}`).innerHTML
        document.getElementById('JudulRoom').innerHTML = namaKomunitas
        
        let docRef = db.collection(`Komunitas`).doc(komuniastUID).collection("Pesan").orderBy("timestamp", "desc")
        
        docRef.onSnapshot((querySnapshot)=>{
            if(!querySnapshot.empty){
                setChat(querySnapshot.docs.map((doc)=>{
                    return <ChatBubble {...doc.data()} key={doc.id} />
                }))
            }else{
                setChat("Masih belum ada pesan dari room")
            }
            
        },(err)=>{
            console.log(err);
        })
    }

    function handleFormPesan(e) {
        if(e.target.value.length>0){
            setPesan(e.target.value)
            setChatAble(true)
        }else{
            setChatAble(false)
        }
    }

    async function kirimPesan(e) {
        e.preventDefault();
        await db.collection('Komunitas').doc(komunitasUID).collection('Pesan').add({
            sender_uid: currentUser.uid,
            sender_name: currentUser.displayName,
            sender_photoURL : currentUser.photoURL,
            timestamp:new Date().getTime(),
            body:pesan
          });
        PesanRef.current.value = ""
        dummy.current.scrollIntoView({behavior : 'smooth'})
        db.collection('Komunitas').doc(komunitasUID).update({
            lastChat: new Date().getTime()
        })
        setPesan('')
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
        setKomunitasUID(NewkomunitasUID)
        setChat("Loading....")
        setOnChat(true)

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
        
        await db.collection('Komunitas').doc(komunitasUID).update({
            member: FieldValue.arrayRemove(currentUser.uid)
        })
        .then(async () => {
            await db.collection('Profile').doc(currentUser.uid).update({
                komunitas: FieldValue.arrayRemove(komunitasUID)
            }).then(() => {
                setOnChat(false)
                document.getElementById('JudulRoom').innerHTML = ""
            }).catch((err) => {
                console.log(err);
                return;
            });
        }).catch((err) => {
            console.log(err);
            return ;
        });

    }

    async function handleSearchKomunitas(e){
        e.preventDefault()
        let KomunitasId = searchKomunitas.current.value
        let docRef = db.collection(`Komunitas`).where('id','==',KomunitasId)
        docRef.get().then((querySnapshot)=>{
            if(querySnapshot.docs.length === 0 ){
                setListKomunitas("Belum ada obrolan")
                return;
            }
            setListKomunitas(querySnapshot.docs.map(doc=>{
                return (
                    <Komunitas  {...doc.data()} key={doc.id} komunitas_uid={doc.id} onClick={joinKomunitas} join={true} />
                )
            }))
        })
    }

    useEffect(() => {
        let docRef = db.collection("Komunitas").where("member", "array-contains", currentUser.uid).orderBy("lastChat", "desc")
        docRef.onSnapshot(function(querySnapshot) {
                if(querySnapshot.docs.length === 0 ){
                    setListKomunitas("Belum ada obrolan")
                    return;
                }
                setListKomunitas(querySnapshot.docs.map(doc=>{
                    return (
                        <Komunitas  {...doc.data()} key={doc.id} komunitas_uid={doc.id} onClick={LiatChat} />
                    )
                }))
            },(err)=>{
                console.log(err);
                setListKomunitas("Error X_x")
            })
        
    }, [currentUser])

    return (
        <>
        <NavbarUser />
        <div className="container">

            <div className="content-wrapper">

                <div className="row gutters">

                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">

                        <div className="card m-0">

                            <div className="row no-gutters">
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3">
                                    <div className="users-container">
                                        <div className="chat-search-box">
                                            <form className="input-group" onSubmit={handleSearchKomunitas}>
                                                <input ref={searchKomunitas} className="form-control" placeholder="Search" />
                                                <div className="input-group-btn">
                                                    <button type="submit" className="btn btn-info">
                                                        <i className="fa fa-search"></i>
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                        <ul className="users">
                                            {ListKomunitas}
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-9 col-9">
                                    <div className="selected-user d-flex justify-content-between flex-wrap align-items-center">
                                        <span className="name" id="JudulRoom"></span>
                                        {onChat && <button className="btn btn-danger" onClick={handleExitGroup}>Exit <i className="fas fa-external-link-alt" style={{fontSize:".8rem"}}></i></button>}
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
                                            <form onSubmit={kirimPesan}>
                                                <div className="d-flex flex-row">
                                                <div className="form-group mt-3 mb-0 w-100 h-100">
                                                    <input ref={PesanRef} className="form-control" type="text" placeholder="ketik sesuatu"  onChange={handleFormPesan} />
                                                </div>
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
    </>
    )
}
