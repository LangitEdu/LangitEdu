import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../component/Navbar/Navbar'

import { db } from '../config/Firebase'
import Styled from '@emotion/styled'
    
const Kuis = ({match}) => {
    const [kuisID, setkuisID] = useState(match.params.kuisID)
    const [questions, setquestions] = useState([])
    const [quiz, setquiz] = useState({})
    const [answer, setanswer] = useState([])

    useEffect(() => {
        db.collection('Kuis').doc(kuisID).get().then(function(doc) {
            setquiz(doc.data())
        });
        db.collection('Kuis').doc(kuisID).collection('Questions').get().then(function(querySnapshot) {
            let available = []
            querySnapshot.forEach(function(doc) {     
                available.push(doc.data())            
            })
            setquestions(available)
        });
    }, [kuisID])

    
    const {currentUser} = useAuth()

    const changeAnswer = (value, i) => {
        let data = [...answer]
        data[i] = value
        setanswer(data)
    }

    return (
    <>
        <Navbar />
        <Wrapper>
            <h1>{quiz.Nama}</h1>
            {questions.map((q, i)=>(
                <div className="question-card" key={i}>
                    <h2 key={i}>{q.body}</h2>   
                    <div className="options"><input type="radio" name={`answer${i}`} onClick={(e) => changeAnswer(e.target.value, i)} value={q.options[0].type}/>{q.options[0].body}</div>
                    <div className="options"><input type="radio" name={`answer${i}`} onClick={(e) => changeAnswer(e.target.value, i)} value={q.options[1].type}/>{q.options[1].body}</div>
                    <div className="options"><input type="radio" name={`answer${i}`} onClick={(e) => changeAnswer(e.target.value, i)} value={q.options[2].type}/>{q.options[2].body}</div>
                    <div className="options"><input type="radio" name={`answer${i}`} onClick={(e) => changeAnswer(e.target.value, i)} value={q.options[3].type}/>{q.options[3].body}</div>
                </div >
            ))}
        </Wrapper>
    </>
    );
}
    
const Wrapper = Styled.div(() =>`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    
    .question-card{
        width: 90%;
        max-width: 600px;
        min-width: 340px;
        padding: 24px;
        margin: 12px 0;

        /* fafafa */

        background: #FAFAFA;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
        border-radius: 16px;
    }
`)
    
export default Kuis