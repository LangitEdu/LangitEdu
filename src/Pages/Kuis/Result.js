import React, { useEffect, useState } from 'react'
import Styled from '@emotion/styled'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../config/Firebase'
import Navbar from '../../component/Navbar/Navbar'
    
const Result = ({match}) => {
    const [UserKuis, setUserKuis] = useState({})
    const [historyKuis, sethistoryKuis] = useState([]);
    const kuisID = match.params.kuisID
    const { currentUser } = useAuth()

    useEffect(() => {
        const FireAction = async () => {
            const userKuisData = (await db.collection('Profile').doc(currentUser.uid).collection('Kuis').doc(kuisID).get()).data()
            const journeyData = (await db.collection('Journey').doc(userKuisData.journeyID).get()).data()
            const paketKuis = journeyData.kuisList
            
            let history = []
            for (let i = 0; i < paketKuis.length; i++) {
                history.push((await db.collection('Profile').doc(currentUser.uid).collection('Kuis').doc(paketKuis[i].uid).get()).data().body)
                if (paketKuis[i].uid === kuisID) break
            }
            console.log(history)
            sethistoryKuis(history)
            setUserKuis(userKuisData)
            console.log(userKuisData)
        }

        FireAction()
    }, [kuisID, currentUser.uid])

    return (
    <>
        <Navbar />
        <Wrapper>
            <h1>HASIL : {UserKuis.body}</h1>

            <h5>History kuis untuk topik ini</h5>
            {Array.isArray(historyKuis) && historyKuis.map((hk, i) => (
                <p key={i}>QUIZ {i+1} : {hk}</p>
            ))}
            <h5>jawaban kamu tadi</h5>
            {Array.isArray(UserKuis.answer) && UserKuis.answer.map((ans, i)=>(
                <div key={i}>
                    <p>{ans}</p>
                    <p>{UserKuis.correction[i] ? "benar" : "salah"}</p>
                </div>
            ))}
        </Wrapper>
    </>
    );
}
    
const Wrapper = Styled.div(() =>`
    
`)
    
export default Result