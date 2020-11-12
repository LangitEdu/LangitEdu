import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../component/Navbar/Navbar'
import Spinner from '../component/Spinner/Spin1'

import { db } from '../config/Firebase'
import Styled from '@emotion/styled'
    
const Kuis = ({match}) => {
    const [allowSession, setallowSession] = useState("load");
    const [questions, setquestions] = useState([])
    const [kuis, setkuis] = useState({})
    const [answer, setanswer] = useState([]) 
    const kuisID = match.params.kuisID
    const {currentUser} = useAuth()

    useEffect(() => {
        
        db.collection('Profile').doc(currentUser.uid).collection('Kuis').doc(kuisID).get().then(function(doc) {
            
            if(!doc.exists){
                db.collection('Kuis').doc(kuisID).get().then(function(doc) {
                    setkuis(doc.data())
                })
                db.collection('Kuis').doc(kuisID).collection('Questions').get().then(function(querySnapshot) {
                    let available = []
                    let filler = []          
                    querySnapshot.forEach(function(doc) {     
                        available.push(doc.data())
                        filler.push("")          
                    })
                    document.getElementById('form').reset()
                    setquestions(available)
                    setanswer(filler)
                    setallowSession("allow")
                })
            }else{
                db.collection('Kuis').doc(kuisID).get().then(function(doc) {
                    setkuis(doc.data())
                })
                setallowSession("disallow")
            }
        })
    }, [kuisID, allowSession, currentUser])
        
    
    const changeAnswer = (value, i) => {
        let data = answer
        data[i] = value
        setanswer(data)
        console.log(answer) 
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        console.log("trying to submit");
    
        axios.post('http://localhost:5001/langit-edu/us-central1/api/submit', {
            kuisID : kuisID,
            kuis: kuis,
            answers : answer,
            userID : currentUser.uid
          })
          .then(function (res) {
            console.log(res.data);
          })
          .catch(function (err) {
            console.log(err);
          })
    }

    return (
    <>
        <Navbar />
        <Wrapper allowSession={allowSession}>
            <h1>{kuis.Nama}</h1>
            {allowSession === "allow" &&
                <form id="form" onSubmit={(e)=> handleSubmit(e)}>
                {questions.map((q, i)=>(
                    <div className="question-card" key={i}>
                        <h2 key={i}>{q.body}</h2>   
                        <div className="options"><input type="radio" name={`answer${i}`} onClick={(e) => changeAnswer(e.target.value, i)} value={q.options[0].type}/>{q.options[0].body}</div>
                        <div className="options"><input type="radio" name={`answer${i}`} onClick={(e) => changeAnswer(e.target.value, i)} value={q.options[1].type}/>{q.options[1].body}</div>
                        <div className="options"><input type="radio" name={`answer${i}`} onClick={(e) => changeAnswer(e.target.value, i)} value={q.options[2].type}/>{q.options[2].body}</div>
                        <div className="options"><input type="radio" name={`answer${i}`} onClick={(e) => changeAnswer(e.target.value, i)} value={q.options[3].type}/>{q.options[3].body}</div>
                    </div >
                ))}
                <button type="submit" className="btn-bordered">SELESAI</button>
                </form>
            }
            {allowSession === "disallow" &&
                <h2>MAAF KUIS {kuis.Nama} SUDAH PERNAH DIAMBIL</h2>
            }

            <div className="loader">
                <Spinner />
            </div>
        </Wrapper>
    </>
    )
}
    
const Wrapper = Styled.div(({allowSession}) =>`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .loader{
        display: ${allowSession === "load" ? "flex" : "none"};
        justify-content: center;
        align-items: center;
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: #FAFAFA;
        z-index: 10;
    }
    
    form{
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
    }
`)
    
export default Kuis