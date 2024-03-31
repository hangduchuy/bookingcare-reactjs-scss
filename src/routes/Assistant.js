import React, { Component } from 'react';
import { connect } from "react-redux";
import { Route, Switch } from 'react-router-dom';
import ManageSchedule from '../containers/System/Assistant/ManageSchedule';
import Header from '../containers/Header/Header';
import ManagePatient from '../containers/System/Assistant/ManagePatient';

class Doctor extends Component {
    render() {

        const { isLoggedIn } = this.props;
        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <Route path="/assistant/manage-schedule" component={ManageSchedule} />
                            <Route path="/assistant/manage-patient" component={ManagePatient} />

                        </Switch>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
