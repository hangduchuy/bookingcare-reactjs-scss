import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

class HomeFooter extends Component {

    render() {
        return (
            <div className="">
                <footer className="text-white text-lg-start bg-primary">
                    <div className="container p-4">
                        <div className="row mt-4">
                            <div className="col-lg-4 col-md-12 mb-4 mb-md-0">
                                <h5 className="text-uppercase mb-4">Công ty Cổ phần Công nghệ BookingCare</h5>

                                <p>
                                    Lô B4/D21, Khu đô thị mới Cầu Giấy, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Thành phố Hà Nội, Việt Nam
                                </p>

                                <p>
                                    ĐKKD số: 0106790291. Sở KHĐT Hà Nội cấp ngày 16/03/201
                                </p>

                                <div className="mt-4">

                                    <a type="button" className="px-3 btn btn-floating btn-primary btn-lg"><i className="fab fa-facebook-f"></i></a>

                                    <a type="button" className="px-3 btn btn-floating btn-primary btn-lg"><i className="fab fa-dribbble"></i></a>

                                    <a type="button" className="px-3 btn btn-floating btn-primary btn-lg"><i className="fab fa-twitter"></i></a>

                                    <a type="button" className="px-3 btn btn-floating btn-primary btn-lg"><i className="fab fa-google-plus-g"></i></a>

                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                                <h5 className="text-uppercase mb-4 pb-1">Search something</h5>

                                <ul className="fa-ul" style={{ marginLeft: '1.65em' }}>
                                    <li className="mb-3" >
                                        <span className="fa-li"><i className="fas fa-home"></i></span><span className="ms-2">New York, NY 10012, US</span>
                                    </li>
                                    <li className="mb-3">
                                        <span className="fa-li"><i className="fas fa-envelope"></i></span><span className="ms-2">info@example.com</span>
                                    </li>
                                    <li className="mb-3">
                                        <span className="fa-li"><i className="fas fa-phone"></i></span><span className="ms-2">+ 01 234 567 88</span>
                                    </li>
                                    <li className="mb-3">
                                        <span className="fa-li"><i className="fas fa-print"></i></span><span className="ms-2">+ 01 234 567 89</span>
                                    </li>
                                </ul>

                            </div>

                            <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                                <h5 className="text-uppercase mb-4">Opening hours</h5>

                                <table className="table text-white">
                                    <tbody className="font-weight-normal">
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
                    <div className="text-center p-3" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                        © 2023 Copyright:
                        <a target='_blank' className="text-white" href="https://www.facebook.com/hangduchuy/">hangduchuy</a>
                    </div>
                </footer>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
