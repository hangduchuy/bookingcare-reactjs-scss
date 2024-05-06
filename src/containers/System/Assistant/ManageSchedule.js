import React, { Component } from 'react'
import { connect } from 'react-redux'
import './ManageSchedule.scss'
import 'datatables.net-dt/js/dataTables.dataTables'
import 'datatables.net-dt/css/jquery.dataTables.min.css'
import $ from 'jquery'
import DatePicker from '../../../components/Input/DatePicker'
import { getListPatientToCheck } from '../../../services/userService'
import moment from 'moment'
import { LANGUAGES } from '../../../utils'
import LoadingOverlay from 'react-loading-overlay'
import CheckRequestDialog from './CheckRequestDialog' // Import dialog component

class ManageSchedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isShowDialog: false, // State để xác định có hiển thị dialog hay không
            id: null // State để lưu thông tin bệnh nhân được chọn
        }
    }

    async componentDidMount() {
        this.getDataPatientToCheck()
        $(document).ready(function () {
            setTimeout(function () {
                $('#myTable').DataTable()
            }, 1000)
        })
    }

    getDataPatientToCheck = async () => {
        let { currentDate } = this.state
        let formattedDate = new Date(currentDate).getTime()
        let res = await getListPatientToCheck({
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
                await this.getDataPatientToCheck()
            }
        )
    }


    // Phương thức để mở dialog và gọi hàm showDoctorRequest
    handleOpenDialogAndFetchRequests = async (id) => {
        if (!id) {
            console.error('Patient ID is missing!')
            return
        }

        // Kiểm tra giá trị id trước khi setState

        // Đặt trạng thái isShowDialog thành true để hiển thị dialog
        await this.setState(
            {
                isShowDialog: true,
                id: id // Lưu thông tin bệnh nhân được chọn
            },
            // () => {
            //     // Gọi hàm showDoctorRequest để lấy danh sách yêu cầu bác sĩ
            //     this.checkRequestDialogRef.showDoctorRequest()
            // }
        )
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
    render() {
        let { dataPatient } = this.state
        let { language } = this.props

        return (
            <>
                <LoadingOverlay active={this.state.isShowLoading} spinner text='Loading...'>
                    <div className='manage-patient-container'>
                        <div className='m-p-title'>QUẢN LÝ YÊU CẦU XÉT NGHIỆM CỦA BÁC SĨ</div>

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
                                                        <th>STT</th>
                                                        <th>Thời gian</th>
                                                        <th>Họ và tên</th>
                                                        <th>Địa chỉ</th>
                                                        <th>Giới tính</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dataPatient &&
                                                        dataPatient.length > 0 &&
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
                                                                    <td className='btn-action'>
                                                                        <button
                                                                            className='mp-btn-confirm btn btn-warning'
                                                                            onClick={() =>
                                                                                this.handleOpenDialogAndFetchRequests(
                                                                                    item.patientData.id
                                                                                )
                                                                            } // Thêm sự kiện onClick để mở dialog và truyền thông tin bệnh nhân
                                                                        >
                                                                            Thực hiện yêu cầu
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </LoadingOverlay>
                {this.state.isShowDialog===true&& (<CheckRequestDialog
                    open={this.state.isShowDialog}
                    onClose={this.handleCloseDialog}
                    onConfirm={this.handleConfirmRequests}
                    patient={this.state.id} // Truyền thông tin bệnh nhân vào dialog
                    ref={(ref) => {
                        this.checkRequestDialogRef = ref
                    }} // Thêm ref để truy cập đến phương thức showDoctorRequest trong CheckRequestDialog
                />)}
                
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule)
