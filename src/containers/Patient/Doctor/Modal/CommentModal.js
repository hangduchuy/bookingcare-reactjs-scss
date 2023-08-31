import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class CommentModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            content: '',
        }

    }

    async componentDidMount() {
        if (this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email,
                name: this.props.dataModal.name,
                content: this.props.dataModal.content
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.props.language !== prevProps.language) {

        }
        if (this.props.dataModal !== prevProps.dataModal) {
            this.setState({
                email: this.props.dataModal.email,
                name: this.props.dataModal.name,
                content: this.props.dataModal.content
            })
        }
    }

    handleOnChangeInput = (event, id) => {
        //good code
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    }

    checkValideInput = () => {
        let isValid = true;
        let arrInput = ['email', 'name', 'content'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameter: ' + arrInput[i]);
                break;
            }
        }
        return isValid;
    }



    handleSendComment = () => {
        let isValid = this.checkValideInput();
        if (isValid === true) {
            //call api create modal
            this.props.sendComment(this.state)
        }

    }

    render() {
        let { isOpenModal, closeCommentModal } = this.props;
        return (

            <>
                <Modal
                    isOpen={isOpenModal}
                    className='booking-modal-container'
                    size='lg'
                    centered
                >
                    <div className='modal-header'>
                        <h5 className='modal-title'>Phản hồi của bạn sẽ giúp người khác dễ dàng lựa chọn bác sĩ phù hợp hơn.</h5>
                        <button type='button' className='close' aria-label='Close' onClick={closeCommentModal}>
                            <span aria-hidden='true'>x</span>
                        </button>
                    </div>
                    <ModalBody>
                        <div className='row'>
                            <div class="col-6 form-group">

                                <label for="feedbackName">Tên </label>
                                <input class="form-control" type="text"
                                    onChange={(event) => { this.handleOnChangeInput(event, "name") }}
                                    value={this.state.name}
                                    placeholder="Tên..." />
                            </div>
                            <div class="col-6 form-group">
                                <label for="feedbackPhone">Email đã đặt lịch</label>
                                <input class="form-control" type="text"
                                    onChange={(event) => { this.handleOnChangeInput(event, "email") }}
                                    value={this.state.email}
                                    placeholder="Email..." />
                            </div>

                            <div class="col-12 form-group">
                                <label for="feedbackContent">Nội dung</label>
                                <textarea class="form-control"
                                    onChange={(event) => { this.handleOnChangeInput(event, "content") }}
                                    value={this.state.content}
                                    type="text"></textarea>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.handleSendComment()}>Send</Button>{' '}
                        <Button color="secondary" onClick={closeCommentModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentModal);
