import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { USER_ROLE } from '../utils'

class Home extends Component {
    render() {
        const { isLoggedIn, userInfo } = this.props
        // let linkToRedirect = isLoggedIn ? '/system' : '/home'
        let linkToRedirect = '/home'
        if (isLoggedIn) {
            switch (userInfo.roleId) {
                case USER_ROLE.ADMIN:
                    linkToRedirect = '/system'
                    break
                case USER_ROLE.DOCTOR:
                    linkToRedirect = '/doctor/manage-patient'
                    break
                case USER_ROLE.ASSISTANT:
                    linkToRedirect = '/assistant/manage-patient'
                    break
                // Add more cases as needed for other roles
                default:
                    linkToRedirect = '/home'
            }
        }

        return <Redirect to={linkToRedirect} />
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
