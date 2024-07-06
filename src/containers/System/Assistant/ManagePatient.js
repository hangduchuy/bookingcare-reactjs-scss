import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import './ManagePatient.scss'
import 'datatables.net-dt/js/dataTables.dataTables'
import 'datatables.net-dt/css/jquery.dataTables.min.css'
import $ from 'jquery'
import DatePicker from '../../../components/Input/DatePicker'
import { TSPT4, TSPT3, getListPatient } from '../../../services/userService'
import moment from 'moment'
import { LANGUAGES } from '../../../utils'
import { toast } from 'react-toastify'
import LoadingOverlay from 'react-loading-overlay'
import CloseStateOfPatient from '../../../components/Dialog/closeStateOfPatient'
import PatientInfoDialog from './PatientInfoDialog'
class ManagePatient extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            dataModal: {},
            isShowLoading: false,
            isDialogOpen: false,
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
        let { currentDate } = this.state
        let formattedDate = new Date(currentDate).getTime()
        let res = await getListPatient({
            date: formattedDate
        })
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapShot) {}

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

    handleBtnConfirm = async (id) => {
        let result = await TSPT3({ id: id })
        if (result) {
            toast.success('Xác nhận thay đổi trạng thái thành công')
        }
    }
    handleBtnDelete = async (id) => {
        let result = await TSPT4({ id: id })
        if (result) {
            toast.success('Đã xóa thành công')
        }
    }

    handleOpenDialog = (id) => {
        this.setState((prevState) => ({ isDialogOpen: true, id: id }))
    }

    handleCloseDialog = () => {
        this.setState({ isDialogOpen: false, id: null })
    }

    handleConfirmDelete = () => {
        // Call your deletion action here with this.state.idToDelete
        // For example: this.props.handleDelete(this.state.idToDelete);
        // Reset state after deletion
        this.setState({ isDialogOpen: false, id: null })
    }

    render() {
        let { dataPatient, isDialogOpen } = this.state
        let { language } = this.props
        return (
            <Fragment>
                <LoadingOverlay active={this.state.isShowLoading} spinner text='Loading...'>
                    <div className='manage-patient-container'>
                        <div className='m-p-title'>QUẢN LÝ LỊCH HẸN BỆNH NHÂN KHÁM BỆNH CỦA BÁC SĨ</div>

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
                                                        <th style={{ width: '60px' }}>STT</th>
                                                        <th>Thời gian</th>
                                                        <th>Họ và tên</th>
                                                        <th>Bác sĩ</th>
                                                        <th>Địa chỉ</th>
                                                        <th>Giới tính</th>
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

                                                            let doctorIsDeleted =
                                                                item.doctorDataBooking.isDeleted === true
                                                            let rowStyle = doctorIsDeleted
                                                                ? { background: '#B2B200' }
                                                                : {}
                                                            return (
                                                                <tr key={index} style={rowStyle}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{time}</td>
                                                                    <td>{item.patientData.firstName}</td>
                                                                    <td>{item.doctorDataBooking.firstName}</td>
                                                                    <td>{item.patientData.address}</td>
                                                                    <td>{gender}</td>
                                                                    <td className='btn-action'>
                                                                        <button
                                                                            className={`${
                                                                                doctorIsDeleted && 'disabled'
                                                                            } mp-btn-confirm btn btn-warning`}
                                                                            disabled={doctorIsDeleted}
                                                                            onClick={() =>
                                                                                this.handleBtnConfirm(item.id)
                                                                            }
                                                                        >
                                                                            Xác nhận
                                                                        </button>
                                                                        <button
                                                                            className='mp-btn-confirm btn btn-red'
                                                                            onClick={() =>
                                                                                this.handleBtnDelete(item.id)
                                                                            }
                                                                        >
                                                                            Hủy bỏ
                                                                        </button>

                                                                        <button
                                                                            className='mp-btn-confirm btn btn-secondary mt-2'
                                                                            onClick={() =>
                                                                                this.handleOpenDialog(item.patientId)
                                                                            }
                                                                        >
                                                                            Cập nhật thông tin
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
                    <CloseStateOfPatient
                        open={this.state.isDialogOpen}
                        handleClose={this.handleCloseDialog}
                        handleConfirmDelete={this.handleConfirmDelete}
                        idToDelete={this.state.id}
                        handleBtnDelete={this.handleBtnDelete}
                    />

                    <PatientInfoDialog
                        open={isDialogOpen}
                        handleClose={this.handleCloseDialog}
                        handleSave={this.handleSaveData}
                        idToUpdate={this.state.id}
                    />
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
