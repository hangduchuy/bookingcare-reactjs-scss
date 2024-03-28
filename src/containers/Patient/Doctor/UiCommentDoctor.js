import React, { Component } from "react";
import { connect } from "react-redux";
import "./UiCommentDoctor.scss";
import { postSendComment, getListCommentForPatient } from "../../../services/userService";
import { toast } from "react-toastify";
import CommentModal from "./Modal/CommentModal";
import moment from "moment";
import LoadingOverlay from "react-loading-overlay";

class UiCommentDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenCommentModal: false,
      dataModal: {},
      isShowLoading: false,
      dataPatient: [],
    };
  }

  async componentDidMount() {
    await this.getDataComment();
  }

  getDataComment = async () => {
    let doctorId = this.props.doctorIdFromParent;
    let res = await getListCommentForPatient({
      doctorId: doctorId,
    });
    if (res && res.errCode === 0) {
      this.setState({
        dataComment: res.data,
      });
    }
  };

  async componentDidUpdate(prevProps, prevState, snapShot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.state.dataComment !== prevState.dataComment) {
      // this.getDataComment();
    }
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      await this.getDataComment();
    }
  }

  handleClickComment = () => {
    this.setState({
      isOpenCommentModal: true,
    });
  };

  closeCommentModal = () => {
    this.setState({
      isOpenCommentModal: false,
      dataModal: {},
    });
  };

  sendComment = async (dataChild) => {
    let doctorId = this.props.doctorIdFromParent;
    this.setState({
      isShowLoading: true,
    });
    let res = await postSendComment({
      email: dataChild.email,
      name: dataChild.name,
      doctorId: doctorId,
      content: dataChild.content,
    });
    if (res && res.errCode === 0) {
      this.setState({
        isShowLoading: false,
      });
      toast.success("Send Comment succeeds");
      this.closeCommentModal();
      await this.getDataComment();
    } else {
      this.setState({
        isShowLoading: false,
      });
      toast.error("Send Comment error");
      console.log("Send Comment error", res);
    }
  };

  render() {
    let { isOpenCommentModal, dataModal, dataComment } = this.state;

    return (
      <LoadingOverlay active={this.state.isShowLoading} spinner text="Loading...">
        <div>
          <button
            className="btn btn-info m-4"
            // key={index}
            onClick={() => this.handleClickComment()}
          >
            Gửi ý kiến sau khi đi khám bác sĩ
          </button>
          <div className="container mb-5">
            <div className="row">
              <div className="col-sm-10 col-sm-offset-1" id="logout">
                <div className="page-header">
                  <h3 className="reviews">Bình Luận</h3>
                </div>

                <div className="comment-tabs">
                  {dataComment && dataComment.length > 0 ? (
                    dataComment.map((item, index) => {
                      return (
                        <div key={index} className="tab-content">
                          <div className="tab-pane active" id="comments-login">
                            <ul className="media-list">
                              <li className="media">
                                <div className="media-body">
                                  <div className="well well-lg">
                                    <h4 className="media-heading text-uppercase reviews">{item.name}</h4>
                                    <ul className="media-date text-uppercase reviews list-inline">
                                      <li className="dd">{moment(item.createdAt).format("YYYY-MM-DD HH:mm")}</li>
                                    </ul>
                                    <p className="media-comment">{item.content}</p>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-warning">Chưa có bình luận</div>
                  )}
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
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UiCommentDoctor);
