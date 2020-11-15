import React, { useEffect, useState } from 'react'
import Styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { db, FieldValue } from '../../config/Firebase'
import Navbar from '../../component/Navbar/Navbar'
import { useAuth } from '../../contexts/AuthContext'

const Topik = ({match}) => {

    const {currentUser} = useAuth()

    const topikKey = typeof match.params.topikKey == 'undefined' ? "default" : match.params.topikKey
    const [Topik, setTopik] = useState({})
    const [IsMember, setIsMember] = useState(false)
    const [TopikId, setTopikId] = useState()
    const [Loading, setLoading] = useState(false)
    useEffect(() => {

        const FireAction = async () => {
            const topikData = await db.collection('Topik').where("topikKey", "==", topikKey).get().then(function (querySnapshot) {
                let filler
                querySnapshot.forEach(function (doc) {
                        setTopikId(doc.id)
                        filler = doc.data()
                })
                return filler
            })
            
            setTopik(topikData)
            setIsMember(topikData.member.includes(currentUser.uid))
        } 

        FireAction()

    }, [topikKey, currentUser])
    const handleJoinTopik = ()=>{
        setLoading(true)
        db.collection('Topik').doc(TopikId).update({
            member : FieldValue.arrayUnion(currentUser.uid)
        }).then(()=>{
            db.collection('Profile').doc(currentUser.uid).update({
                topik : FieldValue.arrayUnion(TopikId)
            }).then(()=>{
                setIsMember(true)
                setLoading(false)
            }).catch(err=>{
                console.log(err);
                setLoading(false)
            })
        }).catch(err=>{
            console.log(err);
            setLoading(false)
        })
    }
    return (
    <>
        <Navbar />
        <Wrapper>
            {topikKey !== "default" && Topik && (
            <>
                <h1>{Topik.nama}</h1>
                {!IsMember &&
                    <>
                    <p>Kamu harus menjadi member untuk melihat lebih banyak</p>
                    <button className="btn btn-primary" onClick={handleJoinTopik} disabled={Loading} >Join Kuis</button>
                    <br/>
                    </>
                }
                { Array.isArray(Topik.journeyList) && Topik.journeyList.map((each, i)=>(
                    <Link className={`btn btn-primary ${IsMember ? '' : 'disabled'}`} to={`/journey/${each.uid}`} key={i} >{each.nama}</Link>
                ))}
            </>
            )}
        </Wrapper>
    </>
    )
}
    
const Wrapper = Styled.div(() =>`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-top: 54px;


    .foundtopik{
        width: 340px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        border: 1px solid #AAA;
        border-radius: 12px;
        flex-direction: column;
        padding: 24px;
        margin-top: 32px;

        p{
            margin-bottom: 12px;
            font-family: Oxygen;
            font-weight: bold;
            font-size: 24px;
        }

    }

    form{
        width: 85%;
        max-width: 600px;
        min-width: 340px;
        display: flex;
        justify-content: center;
        align-items: center;

        input{
            width: 100%;
        }
        button{

        }
    }
    
`)
    
export default Topik