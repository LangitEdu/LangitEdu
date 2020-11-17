const { default: styled } = require("@emotion/styled")

const FooterCopyright = ()=>{
    return (
        <Wrapper>
        <section className="footer-copyright py-2">
            <div className="container d-flex justify-content-between flex-md-row flex-column-reverse text-center">
                <div className="copyright">
                    © Copyright 2020
                </div>
                <div className="nama">
                <img src="/img/white-logo-icon.png" alt="Logo Langit Edu" className="img-fluid"/> LangitEdu | Belajar dimanapun dan kapanpun
                </div>
            </div>
        </section>
        </Wrapper>
    )
}

const Wrapper = styled.div(({screen})=>`

    .footer-copyright{
        background : #007A95;
        color : white;
        font-weight : 400
    }

`)

export default FooterCopyright