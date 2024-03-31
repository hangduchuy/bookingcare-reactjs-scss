import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

function CloseStateOfPatient({ open,idToDelete, handleClose, handleConfirmDelete, handleBtnDelete }) {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
                Bạn có chắc chắn muốn xóa hay không?
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Hủy</Button>
                <Button onClick={() => {
                    handleBtnDelete(idToDelete); // Call handleBtnDelete from props
                    handleConfirmDelete(); // Call handleConfirmDelete from props
                }} color="secondary">Xóa</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CloseStateOfPatient;