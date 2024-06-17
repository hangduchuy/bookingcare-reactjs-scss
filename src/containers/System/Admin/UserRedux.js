import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils'
import * as actions from '../../../store/actions'
import './UserRedux.scss'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import { CSVLink } from 'react-csv'
import TableManageUser from './TableManageUser'
import { toast } from 'react-toastify'
import Papa from 'papaparse'

class UserRedux extends Component {
    constructor(props) {
        super(props)
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',

            action: '',
            userEditId: '',
            dataExport: []
        }
    }

    componentDidMount() {
        this.props.getGenderStart()
        this.props.getPositionStart()
        this.props.getRoleStart()
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        // render => didupdata
        // hien tai (this) va qua khu (previous)
        // [] [3]

        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].key : ''
            })
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].key : ''
            })
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].key : ''
            })
        }
        if (prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux
            let arrPositions = this.props.positionRedux
            let arrRoles = this.props.roleRedux
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].key : '',
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].key : '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].key : '',
                avatar: '',
                action: CRUD_ACTIONS.CREATE,
                previewImgURL: ''
            })
        }
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files
        let file = data[0]
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            let objectUrl = URL.createObjectURL(file)
            this.setState({
                previewImgURL: objectUrl,
                avatar: base64
            })
        }
    }

    openPreviewImage = () => {
        if (!this.state.previewImgURL) return

        this.setState({
            isOpen: true
        })
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput()
        if (isValid === false) return

        let { action } = this.state

        if (action === CRUD_ACTIONS.CREATE) {
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar
            })
        }
        if (action === CRUD_ACTIONS.EDIT) {
            this.props.editUserRedux({
                id: this.state.userEditId,
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar
            })
        }
        // this.props.fetchUserRedux();
        
    }

    checkValidateInput = () => {
        let isValid = true
        let arrCheck = ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'address']
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false
                alert('This input is required:' + arrCheck[i])
                break
            }
        }
        return isValid
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state }
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
    }

    handleEditUserFromParent = (user) => {
        let imageBase64 = ''
        if (user.image) {
            imageBase64 = Buffer.from(user.image, 'base64').toString('binary')
        }

        this.setState({
            email: user.email,
            password: 'HARDCODE',
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            phoneNumber: user.phonenumber,
            gender: user.gender,
            role: user.roleId,
            position: user.positionId,
            avatar: '',
            previewImgURL: imageBase64,
            action: CRUD_ACTIONS.EDIT,
            userEditId: user.id
        })
    }

    getUsersExport = (event, done) => {
        let result = []
        const { listUsers } = this.props
        if (listUsers && listUsers.length > 0) {
            result.push(['Id', 'Email', 'First Name', 'Last Name', 'Address'])
            listUsers.map((item, index) => {
                let arr = []
                arr[0] = item.id
                arr[1] = item.email
                arr[2] = item.firstName
                arr[3] = item.lastName
                arr[4] = item.address
                result.push(arr)
                return null
            })
            this.setState({
                dataExport: result
            })
            done()
        }
    }

    handleImportCSV = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            let file = event.target.files[0]

            if (file.type !== 'text/csv') {
                toast.error('Please select file csv')
                return
            }

            Papa.parse(file, {
                complete: (results) => {
                    let rawCSV = results.data
                    if (rawCSV.length > 0) {
                        if (rawCSV[0] && rawCSV[0].length === 4) {
                            if (
                                rawCSV[0][0] !== 'Email' ||
                                rawCSV[0][1] !== 'First Name' ||
                                rawCSV[0][2] !== 'Last Name' ||
                                rawCSV[0][3] !== 'Address'
                            ) {
                                toast.error('Wrong format header file csv')
                            } else {
                                let result = []
                                rawCSV.map((item, index) => {
                                    if (index > 0 && item.length === 4) {
                                        let obj = {}
                                        obj.email = item[0]
                                        obj.firstName = item[1]
                                        obj.lastName = item[2]
                                        obj.address = item[3]
                                        result.push(obj)
                                    }
                                    return null
                                })
                                this.props.createNewUser(result)
                            }
                        } else {
                            toast.error('Wrong format file csv')
                        }
                    }
                }
            })
        }
    }

    render() {
        let genders = this.state.genderArr
        let positions = this.state.positionArr
        let roles = this.state.roleArr
        let language = this.props.language
        let { email, password, firstName, lastName, phoneNumber, address, gender, position, role, dataExport } =
            this.state

        return (
            <div className='user-redux-container'>
                <div className='title'>Quản lý người dùng</div>
                <div className='user-redux-body'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3'>
                                <b>
                                    <FormattedMessage id='manage-user.add' />
                                </b>
                            </div>
                            <div className='mb-3 col-3'>
                                <label className='form-label'>
                                    <FormattedMessage id='manage-user.email' />
                                </label>
                                <input
                                    type='email'
                                    className='form-control'
                                    value={email}
                                    onChange={(event) => {
                                        this.onChangeInput(event, 'email')
                                    }}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT}
                                />
                            </div>
                            <div className='col-3'>
                                <label className='form-label'>
                                    <FormattedMessage id='manage-user.password' />
                                </label>
                                <input
                                    type='password'
                                    className='form-control'
                                    value={password}
                                    onChange={(event) => {
                                        this.onChangeInput(event, 'password')
                                    }}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT}
                                />
                            </div>
                            <div className='col-3'>
                                <label className='form-label'>
                                    <FormattedMessage id='manage-user.first-name' />
                                </label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={firstName}
                                    onChange={(event) => {
                                        this.onChangeInput(event, 'firstName')
                                    }}
                                />
                            </div>
                            <div className='col-3'>
                                <label className='form-label'>
                                    <FormattedMessage id='manage-user.last-name' />
                                </label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={lastName}
                                    onChange={(event) => {
                                        this.onChangeInput(event, 'lastName')
                                    }}
                                />
                            </div>
                            <div className='col-3'>
                                <label className='form-label'>
                                    <FormattedMessage id='manage-user.phone-number' />
                                </label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={phoneNumber}
                                    onChange={(event) => {
                                        this.onChangeInput(event, 'phoneNumber')
                                    }}
                                />
                            </div>
                            <div className='col-9 mb-3'>
                                <label className='form-label'>
                                    <FormattedMessage id='manage-user.address' />
                                </label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={address}
                                    onChange={(event) => {
                                        this.onChangeInput(event, 'address')
                                    }}
                                />
                            </div>
                            <div className='col-3 mb-3'>
                                <label className='form-label'>
                                    <FormattedMessage id='manage-user.gender' />
                                </label>
                                <select
                                    className='form-control'
                                    onChange={(event) => {
                                        this.onChangeInput(event, 'gender')
                                    }}
                                    value={gender}
                                >
                                    {genders &&
                                        genders.length > 0 &&
                                        genders.map((item, index) => {
                                            return (
                                                <option key={index} value={item.key}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            )
                                        })}
                                </select>
                            </div>
                            <div className='col-3 mb-3'>
                                <label className='form-label'>
                                    <FormattedMessage id='manage-user.position' />
                                </label>
                                <select
                                    className='form-control'
                                    onChange={(event) => {
                                        this.onChangeInput(event, 'position')
                                    }}
                                    value={position}
                                >
                                    {positions &&
                                        positions.length > 0 &&
                                        positions.map((item, index) => {
                                            return (
                                                <option key={index} value={item.key}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            )
                                        })}
                                </select>
                            </div>
                            <div className='col-3 mb-3'>
                                <label className='form-label'>
                                    <FormattedMessage id='manage-user.role' />
                                </label>
                                <select
                                    className='form-control'
                                    onChange={(event) => {
                                        this.onChangeInput(event, 'role')
                                    }}
                                    value={role}
                                >
                                    {roles &&
                                        roles.length > 0 &&
                                        roles.map((item, index) => {
                                            return (
                                                <option key={index} value={item.key}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            )
                                        })}
                                </select>
                            </div>
                            <div className='col-3 mb-3'>
                                <label className='form-label'>
                                    <FormattedMessage id='manage-user.image' />
                                </label>
                                <div className='preview-img-container'>
                                    <input
                                        id='previewImg'
                                        type='file'
                                        hidden
                                        onChange={(event) => this.handleOnChangeImage(event)}
                                    />
                                    <label className='label-upload' htmlFor='previewImg'>
                                        <FormattedMessage id='manage-user.btn-image' />{' '}
                                        <i className=' fas fa-upload'></i>
                                    </label>
                                    <div
                                        className='preview-image'
                                        style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                        onClick={() => this.openPreviewImage()}
                                    ></div>
                                </div>
                            </div>
                            <div className='col-12 my-3 group-btns'>
                                <button
                                    type='submit'
                                    className={
                                        this.state.action === CRUD_ACTIONS.EDIT ? 'btn btn-warning' : 'btn btn-primary'
                                    }
                                    onClick={() => this.handleSaveUser()}
                                >
                                    {this.state.action === CRUD_ACTIONS.EDIT ? (
                                        <FormattedMessage id='manage-user.edit' />
                                    ) : (
                                        <FormattedMessage id='manage-user.save' />
                                    )}
                                </button>
                                <button className='btn btn-warning'>
                                    <label htmlFor='import-user'>
                                        <i className='fas fa-upload'></i> Import
                                    </label>
                                    <input
                                        type='file'
                                        id='import-user'
                                        hidden
                                        onChange={(event) => this.handleImportCSV(event)}
                                    />
                                </button>

                                <CSVLink
                                    filename={'users.csv'}
                                    data={dataExport}
                                    className='btn btn-info'
                                    asyncOnClick={true}
                                    onClick={this.getUsersExport}
                                >
                                    <i className='fas fa-download'></i> Export
                                </CSVLink>
                            </div>

                            <div className='col-12 mb-5'>
                                <TableManageUser
                                    handleEditUserFromParentKey={this.handleEditUserFromParent}
                                    action={this.state.action}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.isOpen === true && (
                    <Lightbox
                        mainSrc={this.state.previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                )}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
        listUsers: state.admin.users
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        editUserRedux: (data) => dispatch(actions.editUser(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux)
