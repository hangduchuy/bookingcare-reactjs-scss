import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import $ from 'jquery'
import moment from 'moment'
import { toast } from 'react-toastify'
import LoadingOverlay from 'react-loading-overlay'

import './ManagePatient.scss'
import 'datatables.net-dt/js/dataTables.dataTables'
import 'datatables.net-dt/css/jquery.dataTables.min.css'
import DatePicker from '../../../components/Input/DatePicker'
import {
    getAllPatientForDoctor,
    postSendRemedy,
    backDataAfterSendRemedy,
    postToHistories
} from '../../../services/userService'
import { LANGUAGES } from '../../../utils'
import RemedyModal from './RemedyModal'
import DetailPatientModal from './DetailPatientModal'
import CheckRequestDialog from '../Doctor/CheckRequestDialog'
class ManagePatient extends Component {
    constructor(props) {
        super(props)
        this.detailPatientModalRef = React.createRef()
        this.state = {
            history: '',
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false,
            isOpenDetailModal: false,
            dataDetailModal: {},
            id: null
        }
    }

    async componentDidMount() {
        this.getDataPatient()

        //initialize datatable
        $(document).ready(function () {
            setTimeout(function () {
                $('#myTable').DataTable()
            }, 1000)
        })
    }

    getDataPatient = async () => {
        let { user } = this.props
        let { currentDate } = this.state
        let formattedDate = new Date(currentDate).getTime()
        let res = await getAllPatientForDoctor({
            doctorId: user.id,
            date: formattedDate
        })
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.props.language !== prevProps.language) {
        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState(
            {
                currentDate: date[0]
            },
            async () => {
                await this.getDataPatient()
            }
        )
    }

    handleBtnConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName
        }
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }

    sendRemedy = async (dataChild) => {
        let { dataModal, history } = this.state

        this.setState({
            isShowLoading: true
        })
        let res = await postSendRemedy({
            email: dataChild.email,
            imgBase64: dataChild.imageBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName
        })
        let res1 = await postToHistories({
            patientId: dataModal.patientId,
            doctorId: dataModal.doctorId,
            description: history.description,
            files: dataChild.imageBase64
        })

        if (res && res.errCode === 0 && res1 && res1.errCode === 0) {
            await this.setState({
                isShowLoading: false
            })
            toast.success('Send Remedy succeeds')
            this.closeRemedyModal()
            await backDataAfterSendRemedy(dataModal.patientId)
            await this.getDataPatient()
        } else {
            this.setState({
                isShowLoading: false
            })
            toast.error('Send Remedy error')
            console.log('Send Remedy error', res)
        }
    }

    handleBtnDetail = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            patientName: item.patientData.firstName,
            genderData: item.patientData.genderData,
            phonenumber: item.patientData.phonenumber
        }
        this.setState({
            isOpenDetailModal: true,
            dataDetailModal: data
        })
    }

    closeDetailModal = () => {
        this.setState({
            isOpenDetailModal: false,
            dataDetailModal: {}
        })
    }
    // Phương thức để mở dialog và gọi hàm showDoctorRequest
    handleOpenDialogAndFetchRequests = async (patientId) => {
        if (!patientId) {
            console.error('Patient ID is missing!')
            return
        }

        // Kiểm tra giá trị id trước khi setState

        // Đặt trạng thái isShowDialog thành true để hiển thị dialog
        await this.setState({
            isShowDialog: true,
            id: patientId // Lưu thông tin bệnh nhân được chọn
        })
    }
    handleCloseDialog = () => {
        // Hàm đóng dialog
        this.setState({
            isShowDialog: false,
            id: null
        })
    }
    handleConfirmRequests = (result) => {
        // Xử lý kết quả xác nhận ở đây (nếu cần)
        console.log('Result of confirming requests:', result)
    }
    handlegetDataToManagePatientFromChild = (childData) => {
        this.setState({ history: childData })
    }
    render() {
        let { dataPatient, isOpenRemedyModal, dataModal, isOpenDetailModal, dataDetailModal } = this.state
        let { language } = this.props

        return (
            <Fragment>
                <LoadingOverlay active={this.state.isShowLoading} spinner text='Loading...'>
                    <div className='manage-patient-container'>
                        <div className='m-p-title'>
                            <FormattedMessage id='manage-patient.title' />
                        </div>
                        <div className='manage-patient-body row'>
                            <div className='col-4 form-group'>
                                <label>Chọn ngày khám</label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className='form-control'
                                    value={this.state.currentDate}
                                />
                            </div>
                            <div className='col-12'>
                                <div className='card shadow mb-4 bg-light'>
                                    <div className='card-body'>
                                        <div className='table-responsive'>
                                            <table id='myTable' className='display'>
                                                <thead className='tbl-header'>
                                                    <tr>
                                                        <th style={{ width: '50px' }}>STT</th>
                                                        <th>Thời gian</th>
                                                        <th>Họ và tên</th>
                                                        <th>Địa chỉ</th>
                                                        <th>Giới tính</th>
                                                        <th>Trạng thái</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dataPatient && dataPatient.length > 0 ? (
                                                        dataPatient.map((item, index) => {
                                                            let time =
                                                                language === LANGUAGES.VI
                                                                    ? item.timeTypeDataPatient.valueVi
                                                                    : item.timeTypeDataPatient.valueEn
                                                            let gender =
                                                                language === LANGUAGES.VI
                                                                    ? item.patientData.genderData.valueVi
                                                                    : item.patientData.genderData.valueEn
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{time}</td>
                                                                    <td>{item.patientData.firstName}</td>
                                                                    <td>{item.patientData.address}</td>
                                                                    <td>{gender}</td>
                                                                    {item.statusId === 'S2' ? (
                                                                        <td>Chưa xác nhận</td>
                                                                    ) : (
                                                                        <td>Đã xác nhận</td>
                                                                    )}

                                                                    <td className='btn-action'>
                                                                        <button
                                                                            className='mp-btn-confirm btn btn-warning'
                                                                            onClick={() => this.handleBtnConfirm(item)}
                                                                        >
                                                                            Xác nhận
                                                                        </button>
                                                                        <button
                                                                            className='mp-btn-remedy btn btn-info'
                                                                            onClick={() => this.handleBtnDetail(item)}
                                                                        >
                                                                            Chi tiết
                                                                        </button>
                                                                        <button
                                                                            className='mp-btn-check btn btn-warning'
                                                                            onClick={() =>
                                                                                this.handleOpenDialogAndFetchRequests(
                                                                                    item.patientId
                                                                                )
                                                                            }
                                                                        >
                                                                            Kiểm tra
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td>Chưa có dữ liệu</td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td className='btn-action'></td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <RemedyModal
                        isOpenModal={isOpenRemedyModal}
                        dataModal={dataModal}
                        closeRemedyModal={this.closeRemedyModal}
                        sendRemedy={this.sendRemedy}
                    />
                    <DetailPatientModal
                        isOpenModal={isOpenDetailModal}
                        dataModal={dataDetailModal}
                        closeDetailModal={this.closeDetailModal}
                        getDataToManagePatient={this.handlegetDataToManagePatientFromChild}
                    />
                    {this.state.isShowDialog === true && (
                        <CheckRequestDialog
                            open={this.state.isShowDialog}
                            onClose={this.handleCloseDialog}
                            onConfirm={this.handleConfirmRequests}
                            patient={this.state.id} // Truyền thông tin bệnh nhân vào dialog
                            ref={(ref) => {
                                this.checkRequestDialogRef = ref
                            }} // Thêm ref để truy cập đến phương thức showDoctorRequest trong CheckRequestDialog
                        />
                    )}
                </LoadingOverlay>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        user: state.user.userInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient)
