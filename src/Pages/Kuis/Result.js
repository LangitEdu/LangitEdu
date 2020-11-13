import React, { useEffect, useState } from 'react'
import Styled from '@emotion/styled'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../config/Firebase'
import Navbar from '../../component/Navbar/Navbar'
    
const Result = ({match}) => {
    const [userKuis, setuserKuis] = useState({})
    const kuisID = match.params.kuisID
    const { currentUser } = useAuth()

    useEffect(() => {
        const FireAction = async () => {
            const userKuisData = (await db.collection('Profile').doc(currentUser.uid).collection('Kuis').doc(kuisID).get()).data()
            setuserKuis(userKuisData)
            console.log(userKuisData)
        }

        FireAction()
    }, [kuisID]);

    return (
    <>
        <Navbar />
        <Wrapper>
            <h1>{userKuis.body}</h1>
        </Wrapper>
    </>
    );
}
    
const Wrapper = Styled.div(() =>`
    
`)
    
export default Result