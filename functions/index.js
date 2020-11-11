const functions = require('firebase-functions')
const admin = require('firebase-admin')
// const { log } = require('firebase-functions/lib/logger')

const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors({origin: ['*']}));

admin.initializeApp()

// exports.addAdminRole = functions.https.onCall((data, context) => {
//     // get user and add custom claims
//     return admin.auth().getUserByEmail(data.email).then(user => {
//         return admin.auth().setCustomUserClaims(user.uid, {
//             admin: true
//         })
//     }).then(() => {
//         return {
//             message: `Success! ${data.email} has been made an admin. YEAY!`
//         }
//     }).catch((err) => {
//         return err;
//     })
// })

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
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
