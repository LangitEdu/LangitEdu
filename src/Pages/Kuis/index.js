import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../component/Navbar/Navbar'
import Spinner from '../../component/Spinner/Spin1'

import { db } from '../../config/Firebase'
import Styled from '@emotion/styled'
    
const Kuis = ({match}) => {
    const [allowSession, setallowSession] = useState("load")
    const [questions, setquestions] = useState([])
    const [kuis, setkuis] = useState({})
    const [isSaved, setisSaved] = useState(false)
    const [showPopup, setshowPopup] = useState(false)
    const kuisID = match.params.kuisID
    const {currentUser} = useAuth()
    const [answer, setanswer] = useState(() => {

        if(localStorage.getItem('savedAnswer') !== null && localStorage.getItem('savedKuisID') === kuisID){
            return localStorage.getItem('savedAnswer').split(",")
        }else{
            return []
        }
    }) 

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
                    resetIfExist("form")
                    setquestions(available)
                    if(answer.length === 0) setanswer(filler)
                    setallowSession("allow")
                })

            }else{
                db.collection('Kuis').doc(kuisID).get().then(function(doc) {
                    setkuis(doc.data())
                })
                setallowSession("disallow")
                
            }
        })
    }, [kuisID, currentUser.uid])

    const resetIfExist = (id) => {
        const element = document.getElementById(id)

        if(typeof(element) != 'undefined' && element != null){
            element.reset()
        }
    }        
    
    const changeAnswer = (value, i) => {
        let data = answer
        data[i] = value
        setanswer(data)
        localStorage.setItem('savedAnswer', answer.join(","))
        localStorage.setItem('savedKuisID', kuisID)
        console.log(answer) 
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        console.log("submiting . . .")
    
        axios.post('http://localhost:5001/langit-edu/us-central1/api/submit', {
            kuisID : kuisID,
            kuis: kuis,
            answers : answer,
            userID : currentUser.uid
          })
          .then(function (res) {
            console.log(res.data.message)
            if (res.data.body){
                setisSaved(true)
                resetIfExist("form")
                localStorage.removeItem('savedAnswer')
            }
            setshowPopup(true)
            setallowSession("done")
        })
        .catch(function (err) {
            console.log(err)
            setshowPopup(true)
          })
    }

    return (
    <>
        <Navbar />
        <Wrapper>

            {allowSession === "allow" &&
            <>
                <h1>{kuis.Nama}</h1>
                <form id="form" onSubmit={(e)=> handleSubmit(e)}>
                {questions.map((q, i)=>(
                    <div className="question-card" key={i}>
                        <h2 key={i}>{q.body}</h2>   
                        <div className="options"><input type="radio" defaultChecked={answer[i] === "A"} name={`answer${i}`} onClick={(e) => changeAnswer(e.target.value, i)} value={q.options[0].type}/>{q.options[0].body}</div>
                        <div className="options"><input type="radio" defaultChecked={answer[i] === "B"} name={`answer${i}`} onClick={(e) => changeAnswer(e.target.value, i)} value={q.options[1].type}/>{q.options[1].body}</div>
                        <div className="options"><input type="radio" defaultChecked={answer[i] === "C"} name={`answer${i}`} onClick={(e) => changeAnswer(e.target.value, i)} value={q.options[2].type}/>{q.options[2].body}</div>
                        <div className="options"><input type="radio" defaultChecked={answer[i] === "D"} name={`answer${i}`} onClick={(e) => changeAnswer(e.target.value, i)} value={q.options[3].type}/>{q.options[3].body}</div>
                    </div >
                ))}
                <button type="submit" className="btn-bordered">SELESAI</button>
                </form>
            </>
            }

            {allowSession === "disallow" &&
                <h2>MAAF KUIS {kuis.Nama} SUDAH PERNAH DIAMBIL</h2>
            }

            {allowSession === "load" && 
                <div className="loader">
                    <Spinner />
                </div>
            }

            {showPopup && 
                <div className="popup-cont">
                    <div className="popup-postsubmit">
                        <p>{isSaved ? "KUIS BERHASIL DIKUMPULKAN" : "MAAF TERJADI KESALAHAN"}</p>
                    </div>
                </div>
            }

        </Wrapper>
    </>
    )
}
    
const Wrapper = Styled.div(() =>`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .checked{
        color: red !important;
    }
    
    .popup-cont{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;

        .popup-postsubmit{
            max-width: 450px;
            width: 90%;
            min-width: 350px;
            height: 200px;
            background: #FAFAFA;
            border-radius: 12px;
            box-shadow: 0 0 12px 0 rgba(0,0,0,0.3);
        }   
    }

    .loader{
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: #FAFAFA;
        z-index: 11;
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