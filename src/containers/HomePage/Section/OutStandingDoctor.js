import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import Slider from 'react-slick'
import { withRouter } from 'react-router'
import _ from 'lodash'
import * as actions from '../../../store/actions'
import { LANGUAGES } from '../../../utils'

class OutStandingDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrDoctors: []
        }
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorsRedux
            })
        }
    }

    componentDidMount() {
        this.props.loadTopDoctors()
    }

    handleDetailDoctor = (doctor) => {
        this.props.history.push(`/detail-doctor/${doctor.id}`)
    }
    handleRedirectToGetDoctor = () => {
        this.props.history.push(`/getall-doctor/`)
    }
    render() {
        let arrDoctors = this.state.arrDoctors
        let { language } = this.props

        return (
            <div className='section-share section-outstanding-doctor'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>
                            <FormattedMessage id='homepage.outstanding-doctor' />
                        </span>
                        <button className='btn-section' onClick={() => this.handleRedirectToGetDoctor()}>
                            <FormattedMessage id='homepage.search' />
                        </button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {arrDoctors &&
                                arrDoctors.length > 0 &&
                                arrDoctors.map((item, index) => {
                                    let imageBase64 = ''
                                    if (item.image) {
                                        imageBase64 = Buffer.from(item.image, 'base64').toString('binary')
                                    }
                                    let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`
                                    let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`

                                    let specialty = item.Doctor_Infor.Specialty.name
                                    return (
                                        <div
                                            className='section-customize'
                                            key={index}
                                            onClick={() => this.handleDetailDoctor(item)}
                                        >
                                            <div className='customize-border'>
                                                <div className='outer-bg'>
                                                    <div
                                                        className='bg-image section-outstanding-doctor'
                                                        style={{ backgroundImage: `url(${imageBase64})` }}
                                                    />
                                                </div>
                                                <div className='position text-center title-section'>
                                                    <div>{language === LANGUAGES.VI ? nameVi : nameEn}</div>

                                                    <div>{!_.isEmpty(specialty) === true ? specialty : `Tim Mạch`}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                        </Slider>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        topDoctorsRedux: state.admin.topDoctors,
        language: state.app.language
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor))
