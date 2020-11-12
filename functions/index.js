const functions = require('firebase-functions')
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

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
    
    app.post("/submit", submit)
    app.get("/halo", halo)
    
    
    
exports.api = functions.region("asia-southeast2").https.onRequest(app);
    