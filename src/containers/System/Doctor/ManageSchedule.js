import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageSchedule.scss';
import Select from 'react-select';
import * as actions from '../../../store/actions';
import { CRUD_ACTIONS, LANGUAGES, dateFormat } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import { toast } from "react-toastify";
import _ from 'lodash';
import { saveBulkScheduleDoctor } from '../../../services/userService';
import LoadingOverlay from 'react-loading-overlay';

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: [],
            isShowLoading: false
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.fetchAllScheduleTime();
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            })
        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                data = data.map(item => {
                    item.isSelected = false;
                    return item;
                })
                // data = data.map(item => ({ ...item, isSelected: false }))
            }
            this.setState({
                rangeTime: data
            })
        }
        // if (prevProps.language !== this.props.language) {
        //     let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
        //     this.setState({
        //         listDoctors: dataSelect
        //     })
        // }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`
                let labelEn = `${item.firstName} ${item.lastName}`
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object)
            })
        }
        return result;
    }

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor });

    };

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        })
    }

    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            })
            this.setState({
                rangeTime: rangeTime
            })
        }
    }

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let result = [];
        let doctorId = -1;
        if (!currentDate) {
            toast.error("Invalid date!");
            return;
        }
        if (!selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error("Invalid selected Doctor!");
            return;
        }
        // let formatedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
        let formatedDate = new Date(currentDate).getTime();
        if (this.props.userInfo && this.props.userInfo.roleId === 'R1') {
            doctorId = selectedDoctor.value;
        } else {
            doctorId = this.props.userInfo.id
        }
        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map((schedule, index) => {
                    let object = {};
                    object.doctorId = doctorId;
                    object.date = formatedDate;
                    object.timeType = schedule.key;
                    result.push(object);
                })
            } else {
                toast.error("Invalid selected time!");
                return;
            }
        }
        this.setState({ isShowLoading: true })
        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: doctorId,
            formatedDate: formatedDate
        });

        if (res && res.errCode === 0) {
            this.setState({ isShowLoading: false })
            toast.success("Save Infor succeed!")
        } else {
            this.setState({ isShowLoading: false })
            toast.error("Error saveBulkScheduleDoctor")
            console.log("Error saveBulkScheduleDoctor", res)
        }
    }

    render() {
        let { rangeTime } = this.state;
        let { language, userInfo } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

        return (
            <React.Fragment>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading...'
                >
                    <div className="manage-schedule-container">
                        <div className='m-s-title'>
                            <FormattedMessage id='manage-schedule.title' />
                        </div>
                        <div className='container'>
                            <div className='row'>
                                {userInfo && userInfo.roleId === "R1" ?
                                    <div className='col-6 form-group'>
                                        <label><FormattedMessage id='manage-schedule.choose-doctor' /></label>
                                        <Select
                                            value={this.state.selectedDoctor}
                                            onChange={this.handleChangeSelect}
                                            options={this.state.listDoctors}
                                        />
                                    </div>
                                    :
                                    <div className='col-6 form-group'>
                                        <label><FormattedMessage id='manage-schedule.choose-doctor' /></label>
                                        <input type="text" className="form-control"
                                            value={userInfo.lastName + ' ' + userInfo.firstName}
                                            disabled
                                        />
                                    </div>
                                }
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id='manage-schedule.choose-date' /></label>
                                    <DatePicker
                                        onChange={this.handleOnChangeDatePicker}
                                        className='form-control'
                                        value={this.state.currentDate}
                                        minDate={yesterday}
                                    />
                                </div>
                                <div className='col-12 pick-hour-container'>
                                    {rangeTime && rangeTime.length > 0 &&
                                        rangeTime.map((item, index) => {
                                            return (
                                                <button
                                                    className={item.isSelected === true ?
                                                        'btn btn-warning' : 'btn btn-outline-warning text-dark border-dark'}
                                                    key={index}
                                                    onClick={() => this.handleClickBtnTime(item)}
                                                >
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </button>

                                            )
                                        })
                                    }
                                </div>
                                <div className='col-12'>
                                    <button className='btn btn-primary mt-3'
                                        onClick={() => this.handleSaveSchedule()}
                                    >
                                        <FormattedMessage id='manage-schedule.save' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </LoadingOverlay>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
