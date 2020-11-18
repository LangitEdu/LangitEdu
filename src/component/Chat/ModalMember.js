import React, { useEffect, useState } from 'react'
import { db, FieldValue } from '../../config/Firebase'

export default function ModalMember(props) {
    const [Loading, setLoading] = useState(false)
    const [ListBanUser, setListBanUser] = useState([])
    const PotongString = (str)=>{
        const panjangString = 50
        if(str.length > 50){
            return str.substring(0,panjangString)+"..."
        }else{
            return str
        }
    }
    const getUid = (target)=>{
        if(target.dataset.uid !== undefined){
            return target.dataset.uid
        }else{
            return getUid(target.parentNode)
        }
    }
    const handleHapusMember=(e)=>{
        setLoading(true)
        const uid = getUid(e.target)
        db.collection('Komunitas').doc(props.CurrentKomunitas.uid).update({
            member: FieldValue.arrayRemove(uid)
        }).then(()=>{
            db.collection('Profile').doc(uid).update({
                komunitas:FieldValue.arrayRemove(props.CurrentKomunitas.uid)
            })
            .then(()=>{
                setLoading(false)
            })
            .catch(err=>{
                console.log(err);
                setLoading(false)
            })
        }).catch(err=>{
            console.log(err);
            setLoading(false)
        })
    }
    const handleBanMember=(e)=>{
        const uid = getUid(e.target)
        db.collection('Komunitas').doc(props.CurrentKomunitas.uid).update({
            listBanUser : FieldValue.arrayUnion(uid),
            member: FieldValue.arrayRemove(uid)
        }).then(()=>{
            db.collection('Profile').doc(uid).update({
                komunitas:FieldValue.arrayRemove(props.CurrentKomunitas.uid)
            })
            .then(()=>{
                setLoading(false)
            })
            .catch(err=>{
                console.log(err);
                setLoading(false)
            })
        }).catch(err=>{
            console.log(err);
            setLoading(false)
        })
    }
    const handleDeleteBan=(e)=>{
        const uid = getUid(e.target)
        db.collection('Komunitas').doc(props.CurrentKomunitas.uid).update({
            listBanUser : FieldValue.arrayRemove(uid),
        }).then(()=>{
            let NewListBanUser = ListBanUser.filter(doc=>{
                return doc.data().uid !== uid
            })
            setListBanUser(NewListBanUser)
        }).catch(err=>{
            console.log(err);
        })
        
    }
    useEffect(()=>{
        if(props.ListBanUser.length > 0){
            db.collection("Profile")
            .where("uid", "in", props.ListBanUser).get()
            .then(res=>{
                setListBanUser(res.docs)
            })
        }
    }, [props])
    return (
        <>
        <div className="overflow" onClick={props.hideModal}></div>
        <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Member</h5>
                <button type="button" className="close" onClick={props.hideModal}>
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <div className="row">
                    <div className="col-md-6">
                        <h4>Daftar Anggota : </h4>
                        <hr/>
                        <ul>
                            {props.dataMember.map(doc=>{
                                return props.currentUser.uid !==doc.id  && 
                                    <li className="mb-2 d-flex justify-content-between" key={doc.id} >
                                    {PotongString(doc.data().displayName)}
                                    <div>
                                        <button disabled={Loading} className="btn btn-warning mr-2" data-uid={doc.id} onClick={handleBanMember}><i className="fas fa-ban"></i></button>
                                        <button disabled={Loading} className="btn btn-danger" data-uid={doc.id} onClick={handleHapusMember} ><i className="fas fa-times"></i></button>
                                    </div>
                                    </li>
                            })}
                        </ul>
                    </div>
                    <div className="col-md-6">
                        <h4>Daftar Ban :</h4>
                        <hr/>
                        <ul>
                            {ListBanUser.length > 0 ?
                            ListBanUser.map(doc=>{
                                return <li className="mb-2 d-flex justify-content-between" key={doc.id} >
                                {PotongString(doc.data().displayName)}
                                <div>
                                    <button disabled={Loading} className="btn btn-info" data-uid={doc.id} onClick={handleDeleteBan} ><i className="fas fa-times"></i></button>
                                </div>
                                </li>
                            })
                            :
                            <li>Belum ada user yang diban</li>
                            }
                        </ul>
                    </div>
                </div>
            </div>
            </div>
        </div>
        </div>
        </>
    )
}
