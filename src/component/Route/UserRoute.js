import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import RouteName from '../../config/Route';

export default function UserRoute({component : Component, ...rest}) {

    const { currentUser } = useAuth();
    let uid = rest.computedMatch.params.uid;
    if(uid && uid !== currentUser.uid){
        return (
            <Route
            {...rest}
            render = {()=>{
               return <Redirect to={RouteName.login} />
            }}
            ></Route>
        )
    }
    return (
        <Route
            {...rest}
            render = {props=>{
               return currentUser ? <Component {...props} /> : <Redirect to={RouteName.login} />
            }}
        >
            
        </Route>
    )
}
