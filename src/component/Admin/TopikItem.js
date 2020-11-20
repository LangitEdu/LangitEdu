import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { db, FieldValue } from '../../config/Firebase'
import {routeSet} from '../../config/Route'
import { useAuth } from '../../contexts/AuthContext'
import parse from 'html-react-parser'
import Styled from '@emotion/styled'
import useResize from 'use-resize'


export default function TopikItem(props) {
    const [ElementJourneyList, setElementJourneyList] = useState()
    const namaJourneyRef = useRef()
    const {currentUser} = useAuth()
    const [Loading, setLoading] = useState(false)
    const [Error, setError] = useState()
    const screen = useResize().width
    
    const handleCreateKuis = (e)=>{
        e.preventDefault()
        setLoading(true)
        const namaJourney = namaJourneyRef.current.value
        if(namaJourney.length < 3){
            setError({message:'Nama Journey minimal 3 karakter'})
            setLoading(false)
            return ;
        }
        db.collection('Journey').add({
            name: namaJourney,
            created_by : {
                name : currentUser.displayName,
                uid : currentUser.uid,
                JourneyList : []
            },
            created_at : FieldValue.serverTimestamp(),
            topikID : props.docid
        }).then(res=>{
            db.collection('Topik').doc(props.docid).update({
                journeyList : FieldValue.arrayUnion({nama:namaJourney, uid:res.id})
            }).then(()=>{
                setLoading(false)
                namaJourneyRef.current.value = ''
            }).catch(err=>{
                console.log(err)
                setLoading(false)
                setError(err)
            })
        }).catch(err=>{
            console.log(err)
            setLoading(false)
            setError(err)
        })
    }
    useEffect(() => {
        const handleDeleteJourney = (e)=>{
            const data = {
                nama: e.target.dataset.nama,
                uid : e.target.dataset.uid
            }
            setLoading(true)
            db.collection('Journey').doc(data.uid).delete().then(()=>{
                db.collection('Topik').doc(props.docid).update({
                    journeyList : FieldValue.arrayRemove(data)
                }).then(()=>{
                    setLoading(false)
                }).catch(err=>{
                    console.log(err);
                    setLoading(false)
                    setError(err)
                })
                return;
            }).catch(err=>{
                console.log(err);
                setLoading(false)
                setError(err)
            })
            return;
        }
        if(props.journeyList){
            setElementJourneyList(props.journeyList.map(data=>{
                return (
                    <li className="list-group-item d-flex justify-content-between" key={data.uid}>
                        <Link to={routeSet.liatJourney({uid:data.uid})} >{data.nama}</Link>
                        <button className="btn btn-danger" onClick={handleDeleteJourney} data-uid={data.uid} data-nama={data.nama}>Delete</button>
                    </li>)
            }))
        }
    }, [props])
    return (
        <Wrapper screen={screen}>
            <div className="card-header" id={`heading${props.docid}`}>
                <h2 className="mb-0 d-flex justify-content-between">
                    <button className="higher btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target={`#collapse${props.docid}`} aria-expanded="false" aria-controls={`collapse${props.docid}`}>
                        <p>{props.nama}</p>
                        <p className="kelola-journey btn-bordered">{screen > 740 ? 'Kelola' : ''} Journey</p>
                    </button>
                    <div className='d-flex'>
                        <button 
                            className="btn btn-info mr-1 btn-bordered-blue pendek"
                            onClick={props.editFunction}
                            data-uid={props.docid} 
                        >Edit</button>
                        <button className="btn btn-danger btn-bordered-red pendek" onClick={props.deleteFunction} data-uid={props.docid} data-thumbnail={props.ThumbnailRef} >Delete</button>
                    </div>
                </h2>
            </div>
            <div id={`collapse${props.docid}`} className="collapse" aria-labelledby={`heading${props.docid}`} data-parent="#listTopik">
                <div className="card-body">
                    <div className="ml-3 mt-2">                    
                        <p><strong>Topik key : {parse(props.topikKey)}</strong></p>
                        <p>{parse(props.deskripsi)}</p>
                    </div>
                    <br/>
                    <div className="card mt-4">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                {Error && 
                                <div className="alert alert-danger">
                                    {Error.message}
                                </div>
                                }
                                <form onSubmit={handleCreateKuis}>
                                    <div className="form-group row">
                                        <label htmlFor="nama" className="col-md-2 col-form-label">Nama Journey</label>
                                        <div className="col-md-6">
                                            <input ref={namaJourneyRef} type="text" className="form-control" required />
                                        </div>
                                        <div className="col-md-4">
                                            <button type="submit" className={`btn btn-primary ${screen < 740 ? 'mt-2':''}`} onClick={props.ShowModalBuatKuis} disabled={Loading}>
                                                <i className="fas fa-plus mr-2"></i> Buat Journey
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </li>
                        {ElementJourneyList}
                        </ul>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

const Wrapper = Styled.div(({screen}) =>`
    background: #FFFFFF;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    max-width: 858px;
    width: 100%;
    min-width: 340px;
    margin-bottom: 24px;

    .d-flex{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        ${screen < 740 ? 'width: 100%' : ''}
    }
    .pendek{
        height: 64px;
    }
    
    .higher{
        height: 100%;
        
        margin-right: ${screen < 740 ? '0': '24px'};
        margin-bottom: ${screen > 740 ? '0': '24px'};
        ${screen < 740 ? "padding: 0" : ''};
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:hover, &:focus{
            text-decoration: none;
            background: #ddd;
            outline: none;
        }
        .kelola-journey{
            font-size: 18px;
            color: #FFA252;
            height: 58px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-transform: none;
            border: 2px solid #FFA252;
            background: none;

            &:hover{
                background: #FFA252;
                color: white;
            }
        }
        p{
            font-family: Raleway;
            font-style: normal;
            font-weight: 800;
            font-size: 51px;
            line-height: 60px;

            /* Gray 1 */

            color: #333333;
        }
    }
    .card-header{    
        min-height: 124px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        h2{
            width: 100%;
            height: 100%;
            ${screen < 740 ? 'flex-direction: column;': ''}
        }
    }
`)