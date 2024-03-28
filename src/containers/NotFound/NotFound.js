import React, { Component } from "react";
import { connect } from "react-redux";
// import { Link } from 'react-router-dom';
import svg from "../../assets/404.svg";
import "./NotFound.scss";

class NotFound extends Component {
  returnToHome = () => {
    if (this.props.history) {
      this.props.history.push(`/home`);
    }
  };

  render() {
    return (
      <div className="cont-404">
        <img src={svg} alt="svg" />
        <button onClick={() => this.returnToHome()}>Back to Home</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(NotFound);
