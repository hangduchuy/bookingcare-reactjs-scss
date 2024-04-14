import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import {UpdatePatient_Info} from '../../../services/userService'
import { toast } from 'react-toastify'
class PatientInfoDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        personalHistory: '',
        bloodGroup: '',
        bloodPressure: '',
        weight: '',
        height: '',
        temperature: ''
      }
    };
  }
  handleUpdatePatientInfo = async () => {
    const { idToUpdate } = this.props; // Lấy giá trị idToUpdate từ props
    const { formData } = this.state; // Lấy formData từ state

    let res = await UpdatePatient_Info({
        patientId: idToUpdate, // Sử dụng idToUpdate ở đây
        bloodGroup: formData.bloodGroup,
        personalHistory: formData.personalHistory,
        bloodPressure: formData.bloodPressure,
        temperature: formData.temperature,
        weight: formData.weight,
        height: formData.height,
    });
    if (res && res.errCode === 0) {
        this.setState({ isShowLoading: false });
        toast.success('Cập nhật bệnh nhân thành công!');
    } else {
        this.setState({ isShowLoading: false });
        toast.error('Cập nhật bệnh nhân thất bại!');
    }
};
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }));
  };

  handleDialogClose = () => {
    this.setState({
      formData: {
        personalHistory: '',
        bloodGroup: '',
        bloodPressure: '',
        weight: '',
        height: '',
        temperature: ''
      }
    });
    this.props.handleClose();
  };

  handleSaveData = () => {
    // Call save function with formData
    this.handleUpdatePatientInfo()
    this.handleDialogClose();
  };

  render() {
    const { open } = this.props;
    const { formData } = this.state;

    return (
      <Dialog open={open} onClose={this.handleDialogClose}>
        <DialogTitle>Nhập thông tin bệnh nhân</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tiền sử bệnh án"
            type="text"
            fullWidth
            name="personalHistory"
            value={formData.personalHistory}
            onChange={this.handleChange}
          />
          <TextField
            margin="dense"
            label="Nhóm máu"
            type="text"
            fullWidth
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={this.handleChange}
          />
          <TextField
            margin="dense"
            label="Huyết Áp"
            type="text"
            fullWidth
            name="bloodPressure"
            value={formData.bloodPressure}
            onChange={this.handleChange}
          />
          <TextField
            margin="dense"
            label="Cân nặng"
            type="text"
            fullWidth
            name="weight"
            value={formData.weight}
            onChange={this.handleChange}
          />
          <TextField
            margin="dense"
            label="Chiều cao"
            type="text"
            fullWidth
            name="height"
            value={formData.height}
            onChange={this.handleChange}
          />
          <TextField
            margin="dense"
            label="Thân nhiệt"
            type="text"
            fullWidth
            name="temperature"
            value={formData.temperature}
            onChange={this.handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleDialogClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={this.handleSaveData} color="primary">
          Cập nhật
        </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default PatientInfoDialog;