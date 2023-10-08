import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { getAllDoctors } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';
import './GetAllDoctor.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward } from '@fortawesome/free-solid-svg-icons';
class AllDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataDoctor:[],
        }
    }

    async componentDidMount() {
        let res= await getAllDoctors();
        if (res && res.errCode === 0) {
            this.setState({
                dataDoctor: res.data ? res.data : []
            })
        }
        console.log(res.data);
    }

    async componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.props.language !== prevProps.language) {

        }
    }

    handleOnChangeSelect = async (event) => {
      
    }
    handleDetailDoctor = (doctor) => {
        this.props.history.push(`/detail-doctor/${doctor.id}`)
    }
    handleToHomePage = ()=>{
        this.props.history.push("/home")
    }
    render() {
        let dataDoctor = this.state.dataDoctor;
        let { language } = this.props;
        return (
            <div>
            <div className='navDetail' onClick={() => this.handleToHomePage()}>   <FontAwesomeIcon className='icon' icon={faBackward} />
            <h1>Danh sách Bác Sĩ</h1></div>
            <div className="allDoctor-body">
             
            {dataDoctor && dataDoctor.length > 0 &&
                dataDoctor.map((item, index) => {
                    let imageBase64 = '';
                    if (item.image) {
                        imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                    }
                    return (
                        <div className='doctor-content' key={index} onClick={() => this.handleDetailDoctor(item)}>
                            <img  src={imageBase64}  alt={imageBase64}>
                            </img>
                            <div className='doctor-name'>{item.lastName+' '+item.firstName}</div>
                        </div>
                    )
                })
            }
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AllDoctor);
