import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Route, Switch, Redirect } from 'react-router-dom'
import ManageSchedule from '../containers/System/Doctor/ManageSchedule'
import Header from '../containers/Header/Header'
import ManagePatient from '../containers/System/Doctor/ManagePatient'
import { USER_ROLE } from '../utils'

class Doctor extends Component {
    componentWillMount() {
        const { userInfo, isLoggedIn, history } = this.props

        if (isLoggedIn === true && userInfo.roleId !== USER_ROLE.DOCTOR) {
            history.push('/not-found')
        }
    }

    render() {
        const { isLoggedIn, doctorMenuPath } = this.props

        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                <div className='system-container'>
                    <div className='system-list'>
                        <Switch>
                            <Route path='/doctor/manage-schedule' component={ManageSchedule} />
                            <Route path='/doctor/manage-patient' component={ManagePatient} />
                            <Route
                                component={() => {
                                    return <Redirect to={doctorMenuPath} />
                                }}
                            />
                        </Switch>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        doctorMenuPath: state.app.doctorMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Doctor))
