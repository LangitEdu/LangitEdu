const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

admin.initializeApp()

app.post('/make-admin',async (req,res)=>{
    const data = {
            email: req.body.email,
            tokenAdmin : req.body.tokenAdmin
        }
    if(!(data.email || data.tokenAdmin)){
        return res.status(400).json({status:'error',message:'masukin param yang bener'})
    }
    const decodedToken = await admin.auth().verifyIdToken(data.tokenAdmin)
                                .catch(err=>{
                                    console.log(err);
                                    res.status(500).json({status:'error',message:err.message});
                                    return ;
                                })
    if(!decodedToken.admin){
        res.status(403).json({status:'error',message:'anda bukan admin, anda tidak berhak menambahkan user'})
        return;   
    }
    const user =await admin.auth().getUserByEmail(data.email)
                .catch(function(error) {
                    return res.status(500).json(error)
                });
    return admin.auth().setCustomUserClaims(user.uid, {
        admin: true
    }).then(()=>{
        return res.json({status:'sukses', message: `Berhasil membuat akun anda menjadi admin silahkan logout dan login kembali untuk merefresh akun`});
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({status:'error',message:err.message})
    })
})

exports.api = functions.region("asia-southeast2").https.onRequest(app);

exports.corrector = functions.https.onRequest(async (req, res) => {
    if(req.method !== "POST")return res.status(400).json({message: "Not Allowed"})
    
    let { answers, kuisID } = req.body

    admin.firestore().collection('Kuis').doc(kuisID).collection('Answers').doc('kunci').get().then(function(doc) {
        let kunciArr = []
        kunciArr = doc.data().body

        let hasilUser = []
        kunciArr.forEach((kcr, i) => {
            hasilUser.push(typeof answers[i] !== 'undefined' ? answers[i] === kcr : false)
        })
        
        let nilai = 0
        hasilUser.forEach(hsl => {
            if(hsl) nilai++
        })

        nilai = (nilai/kunciArr.length) * 100

        res.status(200).json({
            message : "Hello World!",
            isi : req.body,
            kunci : kunciArr,
            hasilUser: hasilUser,
            nilai: nilai
        })
    })
    .catch(err => {
        res.status(400).json({
            body : `failed with error : ${err}`
        })
    })

})




// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
