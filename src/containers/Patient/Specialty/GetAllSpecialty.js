import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAllSpecialty } from '../../../services/userService'
import './GetAllSpecialty.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackward } from '@fortawesome/free-solid-svg-icons'
class AllSpecialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSpecialty: []
        }
    }

    async componentDidMount() {
        let res = await getAllSpecialty()
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : []
            })
        }
        console.log(res.data)
    }

    async componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.props.language !== prevProps.language) {
        }
    }

    handleOnChangeSelect = async (event) => {}
    handleDetailSpecialty = (item) => {
        this.props.history.push(`/detail-specialty/${item.id}`)
    }
    handleToHomePage = () => {
        this.props.history.push('/home')
    }
    render() {
        let dataSpecialty = this.state.dataSpecialty
        return (
            <div>
                <div className='navDetail shadow'>
                    {' '}
                    <FontAwesomeIcon className='icon' icon={faBackward} onClick={() => this.handleToHomePage()} />
                    <h1>Danh sách chuyên khoa</h1>
                </div>
                {dataSpecialty &&
                    dataSpecialty.length > 0 &&
                    dataSpecialty.map((item, index) => {
                        return (
                            <div
                                className='specialty-content'
                                key={index}
                                onClick={() => this.handleDetailSpecialty(item)}
                            >
                                <img src={item.image} alt={item.name}></img>
                                <div className='specialty-name'>{item.name}</div>
                            </div>
                        )
                    })}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(AllSpecialty)
