import React from 'react'
import EmailRecovery from './EmailRecovery';
import ResetPassword from './ResetPassword';
import VerifyEmailPage from './VerifyEmailPage';

export default function EmailActionHandle(props) {

    function getParams()
    { 
        let query = window.location.search.substring(1); 
        let vars = query.split("&"); 
        let arrParams = []
        for (let i=0;i<vars.length;i++)
        { 
            let pair = vars[i].split("="); 
            arrParams[pair[0]] = pair[1]
        }
        return arrParams
    }
    const params = getParams()

    console.log(params);
    switch (params['mode']) {
        case 'resetPassword':
            return <ResetPassword
                actionCode={params['oobCode']} 
            />
        case 'recoverEmail':
            return <EmailRecovery
            actionCode={params['oobCode']} 
            />
        break;
        case 'verifyEmail':
            return <VerifyEmailPage actionCode={params['oobCode']} />
        default:
            return (
               <h1>404</h1>
            )
    }
}
