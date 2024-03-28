import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Modal } from 'reactstrap'
import _ from 'lodash'
import Select from 'react-select'
import { toast } from 'react-toastify'
import moment from 'moment'
import LoadingOverlay from 'react-loading-overlay'
import { PayPalButton } from 'react-paypal-button-v2'

import ProfileDoctor from '../ProfileDoctor'
import './BookingModal.scss'
import DatePicker from '../../../../components/Input/DatePicker'
import * as actions from '../../../../store/actions'
import { LANGUAGES } from '../../../../utils'
import { postPatientBookAppointment, getProfileDoctorById } from '../../../../services/userService'

// const initialOptions = {
//   clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID,
//   currency: "VND",
//   intent: "capture",
// };

class BookingModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            selectedGender: '',
            doctorId: '',
            genders: '',
            timeType: '',
            isShowLoading: false,
            isShowPaypal: false,
            sdkReady: false,
            isShowPaypalSuccess: false,
            priceToChild: '',
            dataProfile: {}
        }
    }

    async componentDidMount() {
        let data = await this.getInforDoctor(this.props.dataTime.doctorId)
        this.setState({
            dataProfile: data
        })

        this.props.getGenderStart()
        if (!window.paypal) {
            this.addPayPalScript()
        } else {
            this.setState({ sdkReady: true })
        }
    }

    getInforDoctor = async (id) => {
        let result = {}
        if (id) {
            let res = await getProfileDoctorById(id)
            if (res && res.errCode === 0) {
                result = res.data
            }
        }
        return result
    }

    buildDataGender = (data) => {
        let result = []
        let language = this.props.language
        if (data && data.length > 0) {
            data.map((item) => {
                let object = {}
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn
                object.value = item.key
                result.push(object)
                return null
            })
        }
        return result
    }

    async componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.dataTime !== prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.doctorId
                let timeType = this.props.dataTime.timeType
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }
        if (this.props.dataTime.doctorId !== prevProps.dataTime.doctorId) {
            let data = await this.getInforDoctor(this.props.dataTime.doctorId)
            this.setState({
                dataProfile: data
            })
        }
    }

    handleOnchangeInput = (event, id) => {
        let valueInput = event.target.value
        let stateCopy = { ...this.state }
        stateCopy[id] = valueInput
        this.setState({
            ...stateCopy
        })
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({ selectedGender: selectedOption })
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn

            let date =
                language === LANGUAGES.VI
                    ? moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                    : moment
                          .unix(+dataTime.date / 1000)
                          .locale('en')
                          .format('ddd - MM/DD/YYYY')

            return `${time} - ${date}`
        }
        return ''
    }

    buildDoctorName = (dataTime) => {
        let { language } = this.props
        if (dataTime && !_.isEmpty(dataTime)) {
            let name =
                language === LANGUAGES.VI
                    ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                    : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`

            return name
        }
        return ''
    }

    handleConfirmBooking = async () => {
        let date = new Date(this.state.birthday).getTime()
        let timeString = this.buildTimeBooking(this.props.dataTime)
        let doctorName = this.buildDoctorName(this.props.dataTime)
        this.setState({ isShowLoading: true })
        let res = await postPatientBookAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.props.dataTime.date,
            birthday: date,
            selectedGender: this.state.selectedGender.value,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        })
        if (res && res.errCode === 0) {
            this.setState({ isShowLoading: false })
            toast.success('Booking a new appointment succceed!')
            this.props.closeBookingModal()
        } else {
            this.setState({ isShowLoading: false })
            toast.error('Booking a new appointment error!')
        }
    }

    handlePayPal = () => {
        this.setState({ isShowPaypal: true })
    }
    handleClosePayPal = () => {
        this.setState({ isShowPaypal: false })
    }

    addPayPalScript = async () => {
        // const { data } = await getPaymentConfig();
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}`
        script.async = true
        script.onload = () => {
            this.setState({ sdkReady: true })
        }
        document.body.appendChild(script)
    }

    onSuccessPayment = () => {
        toast.success('Thanh toán thành công!')
        this.setState({ isShowPaypalSuccess: true })
    }

    setPrice = (number) => {
        this.setState({
            priceToChild: number
        })
    }

    render() {
        let { isOpenModal, closeBookingModal, dataTime, language } = this.props
        let { dataProfile } = this.state
        let price = ''
        let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : ''

        if (dataProfile && dataProfile.Doctor_Infor && language === LANGUAGES.VI) {
            price = dataProfile.Doctor_Infor.priceTypeData.valueVi / 24000
        }
        if (dataProfile && dataProfile.Doctor_Infor && language === LANGUAGES.EN) {
            price = dataProfile.Doctor_Infor.priceTypeData.valueEn
        }

        return (
            <>
                <LoadingOverlay active={this.state.isShowLoading} spinner text='Loading...'>
                    <Modal
                        isOpen={isOpenModal}
                        // toggle={() => { this.toggle() }}
                        className='booking-modal-container'
                        size='lg'
                        centered
                    >
                        <div className='booking-modal-content'>
                            <div className='booking-modal-header'>
                                <span className='left'>
                                    <FormattedMessage id='patient.booking-modal.title' />
                                </span>
                                <span className='right' onClick={closeBookingModal}>
                                    <i className='fas fa-times text-muted'></i>
                                </span>
                            </div>
                            <div className='booking-modal-body'>
                                <div className='doctor-infor'>
                                    <ProfileDoctor
                                        doctorId={doctorId}
                                        isShowDescriptionDoctor={false}
                                        dataTime={dataTime}
                                        isShowLinkDetail={false}
                                        isShowPrice={true}
                                        setPrice={this.setPrice}
                                    />
                                </div>
                                <div className='row'>
                                    <div className='col-6 form-group'>
                                        <label>
                                            <FormattedMessage id='patient.booking-modal.fullName' />
                                        </label>
                                        <input
                                            className='form-control'
                                            value={this.state.fullName}
                                            onChange={(event) => this.handleOnchangeInput(event, 'fullName')}
                                        />
                                    </div>
                                    <div className='col-6 form-group'>
                                        <label>
                                            <FormattedMessage id='patient.booking-modal.phoneNumber' />
                                        </label>
                                        <input
                                            className='form-control'
                                            value={this.state.phoneNumber}
                                            onChange={(event) => this.handleOnchangeInput(event, 'phoneNumber')}
                                        />
                                    </div>
                                    <div className='col-6 form-group'>
                                        <label>
                                            <FormattedMessage id='patient.booking-modal.email' />
                                        </label>
                                        <input
                                            className='form-control'
                                            value={this.state.email}
                                            onChange={(event) => this.handleOnchangeInput(event, 'email')}
                                        />
                                    </div>
                                    <div className='col-6 form-group'>
                                        <label>
                                            <FormattedMessage id='patient.booking-modal.address' />
                                        </label>
                                        <input
                                            className='form-control'
                                            value={this.state.address}
                                            onChange={(event) => this.handleOnchangeInput(event, 'address')}
                                        />
                                    </div>
                                    <div className='col-12 form-group'>
                                        <label>
                                            <FormattedMessage id='patient.booking-modal.reason' />
                                        </label>
                                        <input
                                            className='form-control'
                                            value={this.state.reason}
                                            onChange={(event) => this.handleOnchangeInput(event, 'reason')}
                                        />
                                    </div>
                                    <div className='col-6 form-group'>
                                        <label>
                                            <FormattedMessage id='patient.booking-modal.birthday' />
                                        </label>
                                        <DatePicker
                                            onChange={this.handleOnChangeDatePicker}
                                            className='form-control'
                                            value={this.state.birthday}
                                        />
                                    </div>
                                    <div className='col-6 form-group'>
                                        <label>
                                            <FormattedMessage id='patient.booking-modal.gender' />
                                        </label>
                                        <Select
                                            value={this.state.selectedGender}
                                            onChange={this.handleChangeSelect}
                                            options={this.state.genders}
                                            placeholder={<FormattedMessage id='manage-user.gender' />}
                                        />
                                    </div>
                                    <div className='col-7 form-group'>
                                        <label className='col-7'>
                                            <b>Chọn phương thức thanh toán</b>
                                        </label>
                                        <div className='form-check form-check-inline'>
                                            <input
                                                className='form-check-input'
                                                type='radio'
                                                name='inlineRadioOptions'
                                                id='inlineRadio1'
                                                value='option1'
                                                onClick={() => this.handleClosePayPal()}
                                            />
                                            <label className='form-check-label' for='inlineRadio1'>
                                                Thanh toán sau khi khám
                                            </label>
                                        </div>
                                        <div className='form-check form-check-inline'>
                                            <input
                                                className='form-check-input me-3'
                                                type='radio'
                                                name='inlineRadioOptions'
                                                id='inlineRadio2'
                                                value='option2'
                                                onClick={() => this.handlePayPal()}
                                            />
                                            <label className='form-check-label' for='inlineRadio2'>
                                                <i className='fab fa-paypal'></i> Thanh toán bằng PayPal
                                            </label>
                                        </div>
                                    </div>
                                    {this.state.isShowPaypal === true && this.state.sdkReady === true && (
                                        <div className='col-5 form-group'>
                                            <PayPalButton
                                                amount={price}
                                                // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                                onSuccess={this.onSuccessPayment}
                                                onError={() => {
                                                    alert('Error')
                                                }}
                                            />
                                        </div>
                                    )}
                                    {this.state.isShowPaypalSuccess === true && (
                                        <div className='col-12 form-group success'>
                                            <i className='far fa-check-circle'></i> Thanh toán thành công
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='booking-modal-footer'>
                                <button className='btn btn-primary' onClick={() => this.handleConfirmBooking()}>
                                    <FormattedMessage id='patient.booking-modal.btnConfirm' />
                                </button>
                                <button className='btn btn-secondary' onClick={closeBookingModal}>
                                    <FormattedMessage id='patient.booking-modal.btnCancel' />
                                </button>
                            </div>
                        </div>
                    </Modal>
                </LoadingOverlay>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genders: state.admin.genders
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal)
