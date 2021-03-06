import React from 'react'
import Styled from '@emotion/styled'
    
const Spin2 = () => {
    return (
        <Wrapper>
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </Wrapper>
    );
}
    
const Wrapper = Styled.div(() =>`
display: flex;
justify-content: center;
align-items: center;
.lds-ring {
    display: inline-block;
    position: relative;
    width: 40px;
    height: 40px;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 32px;
    height: 32px;
    margin: 4px;
    border: 4px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
  }
  .lds-ring div:nth-of-type(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-of-type(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-of-type(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
`)
    
export default Spin2