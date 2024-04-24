import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import * as actions from '../../store/actions'
import './Login.scss'
import { handleLoginApi } from '../../services/userService'
import { USER_ROLE } from '../../utils'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: ''
        }
    }

    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })

        try {
            let data = await handleLoginApi(this.state.username, this.state.password)
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            }
            if (data && data.errCode === 0) {
                await this.props.userLoginSuccess(data.user)
                this.redirectBasedOnRole(data.user.roleId) // Redirect based on user's role
            }
        } catch (e) {
            if (e.response) {
                if (e.response.data) {
                    this.setState({
                        errMessage: e.response.data.message
                    })
                }
            }
        }
    }

    redirectBasedOnRole = (role) => {
        const { navigate } = this.props
        if (role === USER_ROLE.ADMIN) {
            navigate('/system/Report') // Redirect admin to settings page
        } else if (role === USER_ROLE.DOCTOR) {
            navigate('/doctor/manage-schedule') // Redirect doctor to dashboard
        } else if (role === USER_ROLE.ASSISTANT) {
            navigate('/assistant/manage-patient') // Redirect assistant to dashboard
        } else {
            // Handle other roles if necessary
        }
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleLogin()
        }
    }

    render() {
        //JSX
        return (
            <div className='login-background'>
                <div className='login-container'>
                    <div className='login-content row'>
                        <div className='col-12 text-center text-login'>Login</div>
                        <div className='col-12 form-group login-input'>
                            <label>Username:</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter your username'
                                value={this.state.value}
                                onChange={(event) => this.handleOnChangeUsername(event)}
                            />
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Password:</label>
                            <div className='custom-input-password'>
                                <input
                                    type={this.state.isShowPassword ? 'text' : 'password'}
                                    className='form-control'
                                    placeholder='Enter your password'
                                    value={this.state.value}
                                    onChange={(event) => this.handleOnChangePassword(event)}
                                    onKeyDown={(event) => this.handleKeyDown(event)}
                                />
                                <span
                                    onClick={() => {
                                        this.handleShowHidePassword()
                                    }}
                                >
                                    <i className={this.state.isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}></i>
                                </span>
                            </div>
                        </div>
                        <div className='col-12' style={{ color: 'red' }}>
                            {this.state.errMessage}
                        </div>
                        <div className='col-12'>
                            <button
                                className='btn-login'
                                onClick={() => {
                                    this.handleLogin()
                                }}
                            >
                                Login
                            </button>
                        </div>
                        <div className='col-12'>
                            <span className='forgot-password'>Forgot your password ?</span>
                        </div>
                        {/* <div className='col-12 text-center mt-3'>
                            <span className='text-other-login'>Or login with:</span>
                        </div> */}
                        {/* <div className='col-12 social-login'>
                            <i className='fab fa-google-plus-g google'></i>
                            <i className='fab fa-facebook-f facebook'></i>
                        </div> */}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (path) => dispatch(push(path)),
        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
