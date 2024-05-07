import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Route, Switch, Redirect } from 'react-router-dom'
import Header from '../containers/Header/Header'
import ManagePatient from '../containers/System/Assistant/ManagePatient'
import { USER_ROLE } from '../utils'

class Assistant extends Component {
    componentWillMount() {
        const { userInfo, isLoggedIn, history } = this.props

        if (isLoggedIn === true && userInfo.roleId !== USER_ROLE.ASSISTANT) {
            history.push('/not-found')
        }
    }

    render() {
        const { isLoggedIn, assistantMenuPath } = this.props

        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                <div className='system-container'>
                    <div className='system-list'>
                        <Switch>
                            {/* <Route path='/assistant/manage-schedule' component={ManageSchedule} /> */}
                            <Route path='/assistant/manage-patient' component={ManagePatient} />
                            <Route
                                component={() => {
                                    return <Redirect to={assistantMenuPath} />
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
        assistantMenuPath: state.app.assistantMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Assistant))
