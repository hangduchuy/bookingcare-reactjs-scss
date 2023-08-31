import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './UiCommentDoctor.scss'
import { postSendComment, getListCommentForPatient } from '../../../services/userService'
import { toast } from "react-toastify";
import CommentModal from './Modal/CommentModal';
import moment from 'moment';

class UiCommentDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpenCommentModal: false,
            dataModal: {},
            isShowLoading: false,
            dataPatient: [],
        }
    }

    async componentDidMount() {
        this.getDataComment();

    }

    getDataComment = async () => {
        let doctorId = this.props.doctorIdFromParent
        let res = await getListCommentForPatient({
            doctorId: doctorId,
        })
        if (res && res.errCode === 0) {
            this.setState({
                dataComment: res.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.props.language !== prevProps.language) {

        }
        if (this.state.dataComment !== prevProps.dataComment) {
            this.getDataComment();
        }
    }

    handleClickComment = () => {
        this.setState({
            isOpenCommentModal: true,

        })
    }

    closeCommentModal = () => {
        this.setState({
            isOpenCommentModal: false,
            dataModal: {}
        })
    }

    sendComment = async (dataChild) => {
        let doctorId = this.props.doctorIdFromParent
        this.setState({
            isShowLoading: true
        })
        let res = await postSendComment({
            email: dataChild.email,
            name: dataChild.name,
            doctorId: doctorId,
            content: dataChild.content,
        });
        console.log('res', res)
        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            })
            toast.success('Send Comment succeeds')
            this.closeCommentModal();
            await this.getDataComment();
        } else {
            this.setState({
                isShowLoading: false
            })
            toast.error('Send Comment error')
            console.log('Send Comment error', res)
        }
    }

    render() {
        let { isOpenCommentModal, dataModal, dataComment } = this.state;

        return (

            <div>
                <button
                    className='btn btn-info m-4'
                    // key={index}
                    onClick={() => this.handleClickComment()}
                >
                    Gửi ý kiến sau khi đi khám bác sĩ
                </button>
                <div class="container mb-5">
                    <div class="row">
                        <div class="col-sm-10 col-sm-offset-1" id="logout">
                            <div class="page-header">
                                <h3 class="reviews">Bình Luận</h3>
                            </div>

                            <div class="comment-tabs">
                                {dataComment && dataComment.length > 0 ?
                                    dataComment.map((item, index) => {
                                        { console.log('item', item) }
                                        return (
                                            <div key={index} class="tab-content">
                                                <div class="tab-pane active" id="comments-login">
                                                    <ul class="media-list">
                                                        <li class="media">
                                                            <div class="media-body">
                                                                <div class="well well-lg">
                                                                    <h4 class="media-heading text-uppercase reviews">{item.name}</h4>
                                                                    <ul class="media-date text-uppercase reviews list-inline">
                                                                        <li class="dd">{moment(item.createdAt).format('YYYY-MM-DD HH:mm')}</li>
                                                                    </ul>
                                                                    <p class="media-comment">
                                                                        {item.content}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        )
                                    })
                                    :
                                    <div className='text-warning'>Chưa có bình luận</div>
                                }
                            </div>


                        </div>
                    </div>
                </div>
                <CommentModal
                    isOpenModal={isOpenCommentModal}
                    dataModal={dataModal}
                    closeCommentModal={this.closeCommentModal}
                    sendComment={this.sendComment}
                />
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(UiCommentDoctor);
