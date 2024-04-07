import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import Slider from 'react-slick'
import { getAllSpecialty } from '../../../services/userService'
import { withRouter } from 'react-router'

class Specialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSpecialty: []
        }
    }

    async componentDidMount() {
        let res = await getAllSpecialty()
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : []
            })
        }
    }

    handleDetailSpecialty = (item) => {
        this.props.history.push(`/detail-specialty/${item.id}`)
    }

    handleRedirectToGetSpecialty = () => {
        this.props.history.push(`/getall-specialty/`)
    }
    render() {
        let { dataSpecialty } = this.state

        return (
            <div className='section-share section-specialty'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>
                            <FormattedMessage id='homepage.specialty-popular' />
                        </span>
                        <button className='btn-section' onClick={() => this.handleRedirectToGetSpecialty()}>
                            <FormattedMessage id='homepage.more-infor' />
                        </button>
                    </div>

                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {dataSpecialty &&
                                dataSpecialty.length > 0 &&
                                dataSpecialty.map((item, index) => {
                                    return (
                                        <div
                                            className='section-customize'
                                            key={index}
                                            onClick={() => this.handleDetailSpecialty(item)}
                                        >
                                            <div
                                                className='bg-image section-specialty'
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            />
                                            <div className='title-section'>{item.name}</div>
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
        language: state.app.language
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty))
