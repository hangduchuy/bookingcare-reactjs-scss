import React, { Component } from 'react'
import { connect } from 'react-redux'
import './HomeFooter.scss'
class HomeFooter extends Component {
    render() {
        return (
            <footer className='text-white text-lg-start bg-primary'>
                <div className='footer-container p-4'>
                    <div className='row mt-4'>
                        <div className='col-lg-4 col-md-12 mb-4 mb-md-0'>
                            <h5 className='text-uppercase mb-4'>Công ty Cổ phần sức khỏe tinh thần</h5>

                            <p>Khu dân cư Nhơn Đức, Huyện Nhà Bè Tp.Hồ Chí Minh</p>

                            <p>ĐKKD số: 0106790291. Sở KHĐT Hà Nội cấp ngày 16/03/201</p>

                            <div className='mt-4'>
                                <button type='button' className='px-3 btn btn-floating btn-primary btn-lg'>
                                    <i className='fab fa-facebook-f'></i>
                                </button>

                                <button type='button' className='px-3 btn btn-floating btn-primary btn-lg'>
                                    <i className='fab fa-dribbble'></i>
                                </button>

                                <button type='button' className='px-3 btn btn-floating btn-primary btn-lg'>
                                    <i className='fab fa-twitter'></i>
                                </button>

                                <button type='button' className='px-3 btn btn-floating btn-primary btn-lg'>
                                    <i className='fab fa-google-plus-g'></i>
                                </button>
                            </div>
                        </div>
                        <div className='col-lg-4 col-md-6 mb-4 mb-md-0'>
                            <h5 className='text-uppercase mb-4 pb-1'>Search something</h5>

                            <ul className='fa-ul' style={{ marginLeft: '1.65em' }}>
                                <div className=''>
                                    <div className='content-left'>
                                        <li className='mb-3'>
                                            <span className='fa-li'>
                                                <i className='fas fa-home'></i>
                                            </span>
                                            <span className='ms-2'>97, Võ Văn Tần, Quận 3, Tp Hồ Chí Minh</span>
                                        </li>
                                        <li className='mb-3'>
                                            <span className='fa-li'>
                                                <i className='fas fa-envelope'></i>
                                            </span>
                                            <span className='ms-2'>DoctorCare@gmail.comm</span>
                                        </li>
                                    </div>
                                    <div className='content-right'>
                                        <li className='mb-3'>
                                            <span className='fa-li'>
                                                <i className='fas fa-phone'></i>
                                            </span>
                                            <span className='ms-2'>+9 999 9999</span>
                                        </li>
                                        <li className='mb-3'>
                                            <span className='fa-li'>
                                                <i className='fas fa-print'></i>
                                            </span>
                                            <span className='ms-2'>+9 999 9999</span>
                                        </li>
                                    </div>
                                </div>
                            </ul>
                        </div>

                        <div className='col-lg-4 col-md-6 mb-4 mb-md-0'>
                            <h5 className='text-uppercase mb-4'>Opening hours</h5>

                            <table className='table text-white'>
                                <tbody className='font-weight-normal'>
                                    <tr>
                                        <td>Mon - Thu:</td>
                                        <td>8am - 9pm</td>
                                    </tr>
                                    <tr>
                                        <td>Fri - Sat:</td>
                                        <td>8am - 1am</td>
                                    </tr>
                                    <tr>
                                        <td>Sunday:</td>
                                        <td>9am - 10pm</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className='text-center p-3' style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                    © 2023 Copyright:{' '}
                    <a
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-white'
                        href='https://www.facebook.com/DoctorCareHA'
                    >
                        DoctorCareHA
                    </a>
                </div>
            </footer>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter)
