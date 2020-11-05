import React from 'react'
import NavbarUser from '../component/Navbar/NavbarUser'
import {useAuth} from '../contexts/AuthContext'

export default function Dashboard() {
    const {currentUser} = useAuth()

    return (
        <>
        <NavbarUser/>
        <div className="container mt-5">
            <h1>Dashboard</h1>
            <h3>Hello {currentUser.displayName} </h3>
        </div>
        </>
    )
}
