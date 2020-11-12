const functions = require("firebase-functions");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

// const { log } = require('firebase-functions/lib/logger')
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()

const submit = (req, res) => {
    const { answers, kuis, kuisID, userID } = req.body

    db.collection('Kuis').doc(kuisID).collection('Answers').doc('kunci').get().then(
    async function(doc) {
        let kunciArr = doc.data().body
        let hasilUser = []
        let nilai = 0
        
        kunciArr.forEach((kunci, i) => {
            hasilUser.push(typeof answers[i] !== 'undefined' ? answers[i] === kunci : false)
        })
        
        hasilUser.forEach(hasil => {
            if(hasil) nilai++
        })
        
        nilai = (nilai/kunciArr.length) * 100
        
        const isSaved = await db.collection('Profile').doc(userID).collection('Kuis').doc(kuisID).set({
            topikID: kuis.topikID,
            kuisID: kuisID,
            namaKuis: kuis.Nama,
            body: nilai,
            answers: answers,
            hasilUser: hasilUser
         
        }).then(() => {
            return 'tersimpan'
        }).catch(err => {
            return `gagal menyimpan err : ${err}`
        })
        

        res.status(200).json({
            
            message : "Hello World!",
            isi : req.body,
            kunci : kunciArr,
            hasilUser: hasilUser,
            nilai: nilai,
            userID : userID,
            isSaved: isSaved
        })
    })
    .catch(err => {
        res.status(400).json({
            body : `failed with error : ${err}`
        })
    })
}

const halo = (req, res) => {
    res.status(200).json({
        message : "Hello World!"
    })
}

app.post("/submit", submit)

app.get("/halo", halo)


exports.api = functions.https.onRequest(app)

