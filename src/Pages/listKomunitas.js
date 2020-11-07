import React, { useEffect, useRef, useState } from 'react'
import ChatBubble from '../component/Chat/ChatBubble';
import Komunitas from '../component/Chat/Komunitas';
import NavbarUser from '../component/Navbar/NavbarUser'
import { db, FieldValue } from '../config/Firebase';
import {useAuth} from '../contexts/AuthContext'

export default function ListKomunitas() {

    const [Error, setError] = useState(false)

    const {currentUser} = useAuth()
    const [ListKomunitas, setListKomunitas] = useState("Loading...")
    const [bakcupListKomunitas, setBakcupListKomunitas] = useState()
    const [Chat, setChat] = useState('Loading...')
    const [onChat, setOnChat] = useState(false)
    const [chatAble, setChatAble] = useState(false)
    const [pesan, setPesan] = useState()
    const [komunitasUID, setKomunitasUID] = useState()
    const [onSerach, setOnSearch] = useState(false)
    const [ShowModal, setShowModal] = useState(false)
    const searchKomunitas = useRef()
    const dummy = useRef()
    const PesanRef = useRef()
    
    const namaKomunitasRef = useRef()
    const idKomunitasRef = useRef()
    const deskripsiKomunitasRef = useRef()

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
        setListKomunitas("Loading....")
        let KomunitasId = searchKomunitas.current.value
        if(KomunitasId.length > 0){
            let docRef = db.collection(`Komunitas`).where('id','==',KomunitasId)
            setOnSearch(true)
            docRef.get().then((querySnapshot)=>{
                if(querySnapshot.docs.length === 0 ){
                    setListKomunitas("Komunitas yang km cari tidak ada")
                    return;
                }
                setListKomunitas(querySnapshot.docs.map(doc=>{
                    return (
                        <Komunitas  {...doc.data()} key={doc.id} komunitas_uid={doc.id} onClick={joinKomunitas} join={true} />
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
        docRef.onSnapshot(function(querySnapshot) {
                if(querySnapshot.docs.length === 0 ){
                    setListKomunitas("Belum ada obrolan")
                    return;
                }
                let listKomunitas = querySnapshot.docs.map(doc=>{
                    return (
                        <Komunitas  {...doc.data()} key={doc.id} komunitas_uid={doc.id} onClick={LiatChat} />
                    )
                })
                setListKomunitas(listKomunitas)
                setBakcupListKomunitas(listKomunitas)
            },(err)=>{
                console.log(err);
                setListKomunitas("Error X_x")
            })
        
    }, [currentUser])
    async function AddKomunitas(e) {
        e.preventDefault()
        setError()
        setShowModal(false)
        let idKomunitas = idKomunitasRef.current.value
        let namaKomunitas = namaKomunitasRef.current.value
        let dekskripsiKomunitas = deskripsiKomunitasRef.current.value
        // Data ga boleh kosong
        if(idKomunitas.length <= 0 || namaKomunitas.length <=0 || dekskripsiKomunitas.length <= 0){
            setError("Data tidak boleh ada yang kosong")
            return;
        }

        // Id ga boleh ada whitespace
        let patt = /\W\s/g
        if(patt.test(idKomunitas)){
            setError("Id tidak boleh mengantuk karanter non word atau white space")
            return
        }
        let checkId = await db.collection("Komunitas").where("id", "==", '@'+idKomunitas.toLowerCase()).get()
        if(checkId.empty){
            let add = await db.collection("Komunitas").add({
                deskripsi: dekskripsiKomunitas,
                id: '@'+idKomunitas.toLowerCase(),
                lastChat : new Date().getTime(),
                nama:namaKomunitas,
                photoUrl : `https://ui-avatars.com/api/?size=128&background=random&name=${namaKomunitas.replace(/\s/g,"+")}`,
                member : [currentUser.uid]
            })
            console.log(add);
        }else{
            console.log("udah ga bisa");
            setError("id komunitas sudah dipakai")
            return
        }
    }  
    return (
        <>
        <NavbarUser />
        <div className="container">
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
                                                <input ref={searchKomunitas} className="form-control" placeholder="Search" />
                                                <div className="input-group-btn">
                                                    <button type="submit" className="btn btn-info" id="btnSearch">
                                                        <i className="fa fa-search"></i>
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                        <ul className="users position-relative">
                                            {ListKomunitas}
                                        </ul>
                                       {ShowModal &&
                                       <> 
                                        <div className="overflow" onClick={()=>{setShowModal(false)}} ></div>
                                        <div className="modal d-block" tabIndex="1">
                                            <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                <h5 className="modal-title">Buat Komunitas</h5>
                                                <button type="button" className="close" onClick={()=>{setShowModal(false)}} aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                                </div>
                                                <form onSubmit={AddKomunitas}>
                                                <div className="modal-body">
                                                    <div className="form-group">
                                                        <label> Nama Komunitas</label>
                                                        <input ref={namaKomunitasRef} className="form-control" type="text" required/>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>ID Komunitas</label>
                                                        <div className="input-group mb-2 mr-sm-2">
                                                        <div className="input-group-prepend">
                                                            <div className="input-group-text">@</div>
                                                            </div>
                                                            <input ref={idKomunitasRef} type="text" className="form-control" required />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Deskripsi</label>
                                                        <textarea ref={deskripsiKomunitasRef} className="form-control" rows="10" required></textarea>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={()=>{setShowModal(false)}}>Close</button>
                                                <button type="submit" className="btn btn-primary">Buat Komunitas</button>
                                                </div>
                                                </form>
                                            </div>
                                            </div>
                                        </div>
                                        </>
                                       }
                                        <button className="btn btn-success tombolBuat m-auto" onClick={()=>{setShowModal(true);setError()}}>
                                            <i className="fas fa-plus"></i>
                                        </button>
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
