import React, { useEffect, useState } from 'react'
import Styled from '@emotion/styled'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../config/Firebase'
import Navbar from '../../component/Navbar/Navbar'
    
const Result = ({match}) => {
    const [userKuis, setuserKuis] = useState({})
    const [historyKuis, sethistoryKuis] = useState([]);
    const kuisID = match.params.kuisID
    const { currentUser } = useAuth()

    useEffect(() => {
        const FireAction = async () => {
            const userKuisData = (await db.collection('Profile').doc(currentUser.uid).collection('Kuis').doc(kuisID).get()).data()
            const paketKuis = (await db.collection('Topik').doc(userKuisData.topikID).get()).data().kuislist
            
            let history = []
            for (let i = 0; i < paketKuis.length; i++) {
                history.push((await db.collection('Profile').doc(currentUser.uid).collection('Kuis').doc(paketKuis[i].uid).get()).data().body)
                if (paketKuis[i].uid === kuisID) break
            }
            console.log(history)
            sethistoryKuis(history)
            setuserKuis(userKuisData)
            console.log(userKuisData)
        }

        FireAction()
    }, [kuisID, currentUser.uid])

    return (
    <>
        <Navbar />
        <Wrapper>
            <h1>HASIL : {userKuis.body}</h1>

            <h5>History kuis untuk topik ini</h5>
            {Array.isArray(historyKuis) && historyKuis.map((hk, i) => (
                <p key={i}>QUIZ {i+1} : {hk}</p>
            ))}
            <h5>jawaban kamu tadi</h5>
            {Array.isArray(userKuis.answers) && userKuis.answers.map((ans, i)=>(
                <div key={i}>
                    <p>{ans}</p>
                    <p>{userKuis.hasilUser[i] ? "benar" : "salah"}</p>
                </div>
            ))}
        </Wrapper>
    </>
    );
}
    
const Wrapper = Styled.div(() =>`
    
`)
    
export default Result