import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../component/Navbar/Navbar'
import RouteName from '../config/Route'

export default function Home() {
    return (
        <>
        <Navbar />
        <div className="jumbotron">
            <div className="container">
                <h1 className="display-4">Langit Edu</h1>
                <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                <hr className="my-4" />
                <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
                <Link className="btn btn-primary btn-lg" to={RouteName.register} >Get Started</Link>
            </div>
        </div>
        <div className="jumbotron">
            <div className="container">
                <h1 className="display-4">Langit Edu</h1>
                <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                <hr className="my-4" />
                <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
                <Link className="btn btn-primary btn-lg" to={RouteName.register} >Get Started</Link>
            </div>
        </div>
        <div className="jumbotron">
            <div className="container">
                <h1 className="display-4">Langit Edu</h1>
                <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                <hr className="my-4" />
                <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
                <Link className="btn btn-primary btn-lg" to={RouteName.register} >Get Started</Link>
            </div>
        </div>
        <div className="jumbotron">
            <div className="container">
                <h1 className="display-4">Langit Edu</h1>
                <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                <hr className="my-4" />
                <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
                <Link className="btn btn-primary btn-lg" to={RouteName.register} >Get Started</Link>
            </div>
        </div>
        </>
    )
}
