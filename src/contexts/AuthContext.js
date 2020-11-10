import React,{ useContext,useState, useEffect } from 'react'
import { auth, googleProvider, db } from '../config/Firebase';

const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    async function signup(data){
        return auth.createUserWithEmailAndPassword(data.email,data.password)
            .then(async (res)=>{
                let user = res.user;
                await user.updateProfile({
                    displayName: data.name,
                    photoURL: `https://ui-avatars.com/api/?size=128&background=random&name=${data.name.replace(/\s/g,"+")}`
                }).then(()=>{
                    user.sendEmailVerification()
                    setCurrentUser(auth.currentUser);
                    db.collection("Profile").doc(auth.currentUser.uid).set({
                        uid : user.uid,
                        displayName : data.name,
                        photoURL : `https://ui-avatars.com/api/?size=128&background=random&name=${data.name.replace(/\s/g,"+")}`,
                        topik: [],
                        komunitas: [],
                        progress: [],
                    })
                    .then(function() {
                        console.log("Document successfully written!");
                    })
                })
            })
    }
    async function SendEmailVerification() {
        return currentUser.sendEmailVerification()
    }
    async function getDashboardData(UserUid){
        let docRef = db.collection("Profile").doc(UserUid);
        let resDoc
        await docRef.get().then(function(doc) {
            resDoc = doc
        })
        return resDoc
    }
    async function signInWithGoogle(){
        googleProvider.addScope('profile');
        googleProvider.addScope('email');
        return auth.signInWithPopup(googleProvider).then((result)=>{
            console.log(result);
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    function login(data){
        return auth.signInWithEmailAndPassword(data.email,data.password)
    }
    function updateProfile(name) {
        return currentUser.updateProfile({
            displayName: name,
        }).then(()=>{
            setCurrentUser(auth.currentUser);
        })
    }
    function logout() {
        return auth.signOut( )
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    useEffect(()=>{
        const unsubcribe =  auth.onAuthStateChanged(user=>{
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubcribe;
    },[])

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updateProfile,
        signInWithGoogle,
        SendEmailVerification,
        getDashboardData
    }

    return (
        <AuthContext.Provider value={value}>
            { !loading && children }
        </AuthContext.Provider>
    )
}
