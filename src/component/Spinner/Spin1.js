import React from 'react'
import Styled from '@emotion/styled'
    
const Spin1 = () => {
    return (
        <Wrapper>
            <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div>
        </Wrapper>
    );
}
    
const Wrapper = Styled.div(() =>`
.spinner {
    margin: 100px auto 0;
    width: 120px;
    text-align: center;
  }
  
  .spinner > div {
    width: 18px;
    height: 18px;
    background-color: rgba(0,0,0,0.2);
  
    margin: 4px;

    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }
  
  .spinner .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  
  .spinner .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
  
  @-webkit-keyframes sk-bouncedelay {
    0%, 80%, 100% { -webkit-transform: scale(0) }
    40% { -webkit-transform: scale(1.0) }
  }
  
  @keyframes sk-bouncedelay {
    0%, 80%, 100% { 
      -webkit-transform: scale(0);
      transform: scale(0);
    } 40% { 
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
    }
  }
`)
    
export default Spin1