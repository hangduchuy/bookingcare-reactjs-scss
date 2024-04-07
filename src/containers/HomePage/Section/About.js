import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

class About extends Component {
    render() {
        return (
            <div className='section-share section-about'>
                <div className='section-about-header'>
                    <FormattedMessage id='homepage.the-media' />
                </div>
                <div className='section-about-content'>
                    <div className='content-left'>
                        {/* <div className='responsive-iframe-container'> */}
                        <iframe
                            width='100%'
                            height='100%'
                            src='https://www.youtube.com/embed/hf1SFXdJfF4'
                            title='Bệnh loãng xương: Âm thầm và nguy hiểm | VTC'
                            frameBorder='0'
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                            allowFullScreen
                        ></iframe>
                        {/* </div> */}
                    </div>
                    <div className='content-right'></div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(About)
