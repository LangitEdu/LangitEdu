import React from 'react'
import {Link} from "react-router-dom";
import RouteName from '../config/Route';
export default function Login() {
    return (
        <div className="container d-flex align-items-center justify-content-center flex-column vh-100">
            <h1>Login</h1>
            <div className="card w-75 mt-3 p-md-3">
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <label htmlFor="Email">Email</label>
                            <input type="text" className="form-control" placeholder="Email address" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="Password">Password</label>
                            <input type="password" className="form-control" placeholder="Password" />
                        </div>
                        <button type="submit" className="btn btn-primary d-block m-auto px-4">Login</button>
                    </form>
                </div>
            </div>
            <p className="mt-4">Belum punya akun ? <Link to={RouteName.register}>Ayo Buat Akun!</Link> </p>
            <p><Link to={RouteName.home}>Back to Home</Link> </p>
        </div>
    )
}
