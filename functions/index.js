const functions = require("firebase-functions");
const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const app = express();
const cors = require("cors");
app.use(cors());

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const submit = (req, res) => {
  const { kuis, journeyID, topikID, userID, answer } = req.body;

  db.collection("Kuis")
    .doc(kuis.kuisID)
    .collection("Answers")
    .doc("kunci")
    .get()
    .then(async (doc) => {
      // console.log(doc);
      let kunciArr = new Array(doc.data().body.length).fill("");
      let pembahasanArr = [];
      let correction = [];

      doc.data().body.forEach((data) => {
        kunciArr[data.id] = data.answer;
        pembahasanArr[data.id] = data.pembahasan;
      });

      kunciArr = kunciArr.filter((item) => item);
      pembahasanArr = pembahasanArr.filter((item) => item);

      let nilai = 0;

      kunciArr.forEach((kunci, i) => {
        const status =
          typeof answer[i] !== "undefined" ? answer[i] === kunci : false;
        correction.push(status);
        if (typeof answer[i] !== "undefined" && answer[i] === kunci) {
          nilai++;
        }
      });

      nilai = (nilai / kunciArr.length) * 100;
      nilai = nilai.toFixed(0);

      const isSaved = await db
        .collection("Profile")
        .doc(userID)
        .collection("Kuis")
        .doc(kuis.kuisID)
        .set({
          topikID: topikID,
          kuisID: kuis.kuisID,
          journeyID: journeyID,
          namaKuis: kuis.nama,
          kunciArr: kunciArr,
          body: nilai,
          answer: answer,
          pembahasan: pembahasanArr,
          correction: correction,
          timestamp: admin.firestore.Timestamp.now(),
        })
        .then(() => {
          db.collection("Kuis")
            .doc(kuis.kuisID)
            .collection("Nilai")
            .doc(userID)
            .set({
              uid: userID,
              nilai: nilai,
              answer: answer,
            })
            .then(() => {
              console.log("Berhasil menyimpan nilai untuk user : ", userID);
              console.log(admin.firestore.Timestamp.now());
              return true;
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).json({
                body: `failed with error : ${err}`,
              });
            });
          return true;
        })
        .catch(() => {
          return false;
        });

      return res.status(200).json({
        message: "Data successfully stored",
        body: isSaved,
      });
    })
    .catch((err) => {
      res.status(400).json({
        body: `failed with errorarere : ${err}`,
      });
    });
};

app.post("/make-admin", async (req, res) => {
  const data = {
    email: req.body.email,
    tokenAdmin: req.body.tokenAdmin,
  };
  if (!(data.email || data.tokenAdmin)) {
    return res
      .status(400)
      .json({ status: "error", message: "masukin param yang bener" });
  }
  const decodedToken = await admin
    .auth()
    .verifyIdToken(data.tokenAdmin)
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: "error", message: err.message });
      return;
    });
  if (!decodedToken.admin) {
    res.status(403).json({
      status: "error",
      message: "anda bukan admin, anda tidak berhak menambahkan user",
    });
    return;
  }
  const user = await admin
    .auth()
    .getUserByEmail(data.email)
    .catch(function (error) {
      return res.status(500).json(error);
    });
  return admin
    .auth()
    .setCustomUserClaims(user.uid, {
      admin: true,
    })
    .then(async () => {
      db.collection("Private")
        .doc("Data")
        .update({
          ListAdmin: admin.firestore.FieldValue.arrayUnion(user.uid),
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(500)
            .json({ status: "error", message: err.message });
        });
      console.log(`Berhasil membuat akun ${data.email} menjadi admin`);
      return res.json({
        status: "sukses",
        message: `Berhasil membuat akun ${data.email} menjadi admin silahkan logout dan login kembali untuk merefresh akun`,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ status: "error", message: err.message });
    });
});

app.post("/submit", submit);
app.get("/get-user", async (req, res) => {
  return admin
    .auth()
    .listUsers(1000)
    .then(function (listUsersResult) {
      listUsersResult.users.forEach(function (userRecord) {
        console.log("user", userRecord.toJSON());
      });
      return res.json({ pesan: "berhasil" });
    })
    .catch(function (error) {
      console.log("Error listing users:", error);
      return res.json({ pesan: "gagal" });
    });
});
app.get("/halo", (req, res) => {
  res.status(200).json({
    message: "halo world",
  });
});

app.get("/klasifikasi-prodi", async (req, res) => {
  let results = [];
  fs.createReadStream("DataKampus/KlasifikasiJurusan.csv")
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", () => {
      let ListKlasifikasiProdi = {};
      results.forEach((prodi) => {
        if (ListKlasifikasiProdi[prodi.study_program_area] === undefined) {
          ListKlasifikasiProdi[prodi.study_program_area] = [];
        }
        ListKlasifikasiProdi[prodi.study_program_area].push(
          prodi.study_program
        );
      });
      db.collection("Private").doc("Data").update({
        ListKlasifikasiProdi: ListKlasifikasiProdi,
      });
      res.json(ListKlasifikasiProdi);
    });
});

app.get("/input-univ", async (req, res) => {
  let results = [];
  fs.createReadStream("DataKampus/campus.csv")
    .pipe(csv())
    .on("data", (data) => {
      if (data.Code !== "") results.push(data);
    })
    .on("end", async () => {
      results.forEach(async (data) => {
        await db
          .collection("University")
          .doc(data.Code)
          .set({
            nama: data.University_Name,
            code: data.Code,
            Status: data.Status,
            Date_of_Establishment: data.Date_of_Establishment,
            Number_SK: data.Number_SK,
            Date_SK: data.Date_SK,
            Address: data.Address,
            City: data.City,
            Province: data.Province,
            Postal_Code: data.Postal_Code,
            Telephone: data.Telephone,
            Faximile: data.Faximile,
            Email: data.Email,
            Rank: data.Ranking_Web_Indonesia,
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      });
      res.json(results);
    });
});

app.get("/masukin-data-prodi", async (req, res) => {
  let results = [];
  fs.createReadStream("DataKampus/KAMPUS/SemuaKampus.csv")
    .pipe(csv())
    .on("data", (data) => {
      if (data.Code !== "" && data.Study_Program_Area !== "#N/A")
        results.push(data);
    })
    .on("end", () => {
      let KampusCode = new Set();
      let arrayOfKampusCode = [];
      let listProdi = {};
      results.forEach(async (prodi) => {
        KampusCode.add(prodi.Campus_Code);
        if (listProdi[prodi.Campus_Code] === undefined) {
          listProdi[prodi.Campus_Code] = [];
        }
        listProdi[prodi.Campus_Code].push(prodi.Study_Program);
        await db.collection("Jurusans").add({
          ...prodi,
        });
      });
      arrayOfKampusCode = Array.from(KampusCode);
      for (const kode of arrayOfKampusCode) {
        db.collection("University")
          .doc(kode)
          .update({
            listProdi: listProdi[kode],
          })
          .then(() => {
            console.log("Berhail Menambahkan ", kode);
          });
      }
      res.json(arrayOfKampusCode);
    });
});

exports.api = functions.region("asia-southeast2").https.onRequest(app);
