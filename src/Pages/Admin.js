import React, { useRef, useState } from 'react'
import Styled from '@emotion/styled'
import speakeasy from 'speakeasy'
import QRCode  from 'qrcode'
const Admin = () => {
    const [UrlQR, setUrlQR] = useState('')
    const [Verify, setVerify] = useState(false)
    const secret = speakeasy.generateSecret({
        name:"Langit Edu"
    });
    const tokenRef = useRef()
    const base32secret = secret.base32
    function MakeQR() {
            QRCode.toDataURL(secret.otpauth_url, function(err, data_url) {
                setUrlQR(data_url)
            });
    }

    function verify(e) {
        e.preventDefault()
        setVerify(true)
        const token = tokenRef.current.value
        const data = {
            secret: base32secret,
            encoding: 'base32',
            token: token
        }
        const status=speakeasy.totp.verify(data)
        setVerify(status)
    }   

    return (
        <Wrapper>
            <h1>QR</h1>

            {Verify && 
            <div className="alert alert-success">
                berhasil diverifikasi
            </div>
            }

            {UrlQR && <img src={UrlQR} alt="Qr"/> }
            <button className="btn btn-primary" onClick={MakeQR}>Make QR</button>

            {UrlQR && 
            <form onSubmit={verify}>
                <div className="form-group">
                    <input type="number" className='form-control' ref={tokenRef} />
                </div>
                <button className='btn btn-primary' >Cek</button>
            </form>
            }
        </Wrapper>
    );
}
    
const Wrapper = Styled.div(() =>`
    
`)
    
export default Admin