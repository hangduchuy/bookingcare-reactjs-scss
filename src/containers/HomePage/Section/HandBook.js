import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import Slider from 'react-slick'
import { withRouter } from 'react-router'
import { getAllHandbook } from '../../../services/userService'
class HandBook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataHandbook: []
        }
    }

    async componentDidMount() {
        let res = await getAllHandbook()
        if (res && res.errCode === 0) {
            this.setState({
                dataHandbook: res.data ? res.data : []
            })
        }
    }

    handleViewDetailHandbook = (item) => {
        this.props.history.push(`/detail-handbook/${item.id}`)
    }

    render() {
        let { dataHandbook } = this.state

        return (
            <div className='section-share section-handbook'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>
                            <FormattedMessage id='homepage.handbook' />
                        </span>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {dataHandbook &&
                                dataHandbook.length > 0 &&
                                dataHandbook.map((item, index) => {
                                    return (
                                        <div
                                            className='section-customize'
                                            key={index}
                                            onClick={() => this.handleViewDetailHandbook(item)}
                                        >
                                            <div
                                                className='bg-image section-specialty'
                                                style={{ backgroundImage: `url(${item.image || ''})` }}
                                            />
                                            <div className='title-section pb-4'>{item.name || ''}</div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HandBook))
