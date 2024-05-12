import React, { Component } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import {showCheckRequest,saveDoctorRequest} from '../../../services/userService'
class CheckRequestDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRequests: {},
            pendingDoctorRequests: {},
            afterSaveRequest:{},
        };
    }
    async componentDidMount() {
        this.showDoctorRequest()
    }
    async componentDidUpdate(prevProps, prevState, snapShot) {
        if(this.props.patient!==prevProps.patient){
            this.showDoctorRequest()
        }
    }

    showDoctorRequest = async () => {
        let { patient } = this.props;

        let res = await showCheckRequest({
            patientId: patient
        });

        if (res && res.errCode === 0) {
            let pendingRequests = res.pendingDoctorRequests; // Giả sử 'name' là thuộc tính chứa tên yêu cầu
            console.log('Pending Doctor Requests:', pendingRequests);
            this.setState({
                pendingDoctorRequests: pendingRequests
            });
        } else {
            console.error('Error fetching pending doctor requests:', res.errMessage);
        }
    }
    
    handleCheckboxChange = (requestName) => {
        this.setState((prevState) => {
            const updatedSelectedRequests = { ...prevState.selectedRequests };

            // Nếu phần tử đã có trong selectedRequests và đang được chọn (true), loại bỏ nó
            if (updatedSelectedRequests[requestName]) {
                delete updatedSelectedRequests[requestName];
            }
            // Nếu phần tử chưa có trong selectedRequests hoặc đang không được chọn (false), thêm nó vào selectedRequests
            else {
                updatedSelectedRequests[requestName] = true;
                
            }
    
            return { selectedRequests: updatedSelectedRequests
             };
        });
    };

    handleConfirm = async() => {
        const { patient } = this.props;
        const { selectedRequests } = this.state;
    
        const requestNames = Object.keys(selectedRequests);
        let result = await saveDoctorRequest(patient, requestNames);

        if (result && result.errCode === 0) {
            // Cập nhật state
            this.setState({ afterSaveRequest: result });
            // Gọi hàm callback truyền từ component cha để thông báo kết quả
            this.props.onConfirm(result);

        } else {
            console.error('Error saving doctor requests:', result.errMessage);

        }
    
        // Đặt lại state và đóng dialog
        this.setState({ selectedRequests: {} });
        this.props.onClose();
    };

    render() {
        const { open, onClose } = this.props;
        const { selectedRequests,pendingDoctorRequests } = this.state;

        return (
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Chọn các yêu cầu đã kiểm tra</DialogTitle>
                <DialogContent>
                    {pendingDoctorRequests.length > 0 ? (
                        pendingDoctorRequests.map((item, index) => (
                            <FormControlLabel
                                key={index}
                                control={
                                    <Checkbox
                                        checked={selectedRequests[item] || false}
                                        onChange={() => this.handleCheckboxChange(item)}
                                    />
                                }
                                label={item.slice(0,-2)}
                            />
                        ))
                    ) : (
                        <div>Không có yêu cầu nào cần kiểm tra</div>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={this.handleConfirm} color="primary">
                        Cập nhật
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default CheckRequestDialog;