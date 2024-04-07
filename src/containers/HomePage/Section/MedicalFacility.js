import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import Slider from 'react-slick'
import { withRouter } from 'react-router'
import { getAllClinic } from '../../../services/userService'

class MedicalFacility extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataCliníc: []
        }
    }

    async componentDidMount() {
        let res = await getAllClinic()
        if (res && res.errCode === 0) {
            this.setState({
                dataCliníc: res.data ? res.data : []
            })
        }
    }

    handleViewDetailClinic = (item) => {
        this.props.history.push(`/detail-clinic/${item.id}`)
    }

    render() {
        let { dataCliníc } = this.state

        return (
            <div className='section-share section-medical-facility'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>
                            <FormattedMessage id='homepage.outstanding-clinic' />
                        </span>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {dataCliníc &&
                                dataCliníc.length > 0 &&
                                dataCliníc.map((item, index) => {
                                    return (
                                        <div
                                            className='section-customize'
                                            key={index}
                                            onClick={() => this.handleViewDetailClinic(item)}
                                        >
                                            <div
                                                className='bg-image section-medical-facility'
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
        isLoggedIn: state.user.isLoggedIn
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility))
