import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailHandbook.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import { getDetailHandbookById } from "../../../services/userService";
import _ from "lodash";

class DetailHandbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataDetailHandbook: {},
    };
  }

  async componentDidMount() {
    if (this.props.match && this.props.match.params && this.props.match.params.id) {
      let id = this.props.match.params.id;

      let res = await getDetailHandbookById({
        id: id,
      });
      console.log(res.data);
      this.setState({
        dataDetailHandbook: res.data,
      });
    }
  }

  async componentDidUpdate(prevProps, prevState, snapShot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  render() {
    let { dataDetailHandbook } = this.state;
    return (
      <div className="detail-specialty-container">
        <HomeHeader />
        <div className="detail-specialty-body">
          <div className="description-specialty">
            {dataDetailHandbook && !_.isEmpty(dataDetailHandbook) && (
              <>
                <img src={dataDetailHandbook.image} width="400" height="200" alt="base64 test">
                  {console.log(dataDetailHandbook.image)}
                </img>
                <div>{dataDetailHandbook.name}</div>
                <div dangerouslySetInnerHTML={{ __html: dataDetailHandbook.descriptionHTML }}></div>
              </>
            )}
          </div>
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailHandbook);
