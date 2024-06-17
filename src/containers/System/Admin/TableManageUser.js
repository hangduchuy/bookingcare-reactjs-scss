import React, { Component } from 'react'
import { connect } from 'react-redux'
import './TableManageUser.scss'
import * as actions from '../../../store/actions'
import 'datatables.net-dt/js/dataTables.dataTables'
import 'datatables.net-dt/css/jquery.dataTables.min.css'
import $ from 'jquery'

class TableManageUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            usersRedux: []
        }
    }

    componentDidMount() {
        this.props.fetchUserRedux()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState(
                {
                    usersRedux: this.props.listUsers
                },
                () => {
                    this.reinitializeDataTable()
                }
            )
        }
    }

    componentWillUnmount() {
        if ($.fn.DataTable.isDataTable('#myTable')) {
            $('#myTable').DataTable().clear().destroy(true);
        }
    }

    reinitializeDataTable = () => {
        this.destroyDataTable();
        $(document).ready(() => {
            $('#myTable').DataTable();
        });
    };

    destroyDataTable = () => {
        if ($.fn.DataTable.isDataTable('#myTable')) {
            $('#myTable').DataTable().clear().destroy();
        }
    };

    handleDeleteUser = (user) => {
        console.log('handleDeleteUser:', user)
        this.props.deleteUserRedux(user.id).then(() => {
            setTimeout(() => {
                window.location.reload(); // Reload lại trang sau khi xóa người dùng thành công với delay
            }, 800); // Delay 1 giây trước khi reload lại trang
        }).catch((error) => {
            console.error("Error deleting user: ", error);
        });
    }

    handleEditUser = (user) => {
        this.props.handleEditUserFromParentKey(user)
    }

    render() {
        let arrUsers = this.state.usersRedux

        return (
            <div className='card shadow mb-4 bg-light'>
                <div className='card-body'>
                    <div className='table-responsive'>
                        <table id='myTable' className='display'>
                            <thead className='tbl-header'>
                                <tr>
                                    <th>Email</th>
                                    <th>First name</th>
                                    <th>Last name</th>
                                    <th>Address</th>
                                    <th>Sửa</th>
                                    <th>Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {arrUsers && arrUsers.length > 0 ? (
                                    arrUsers.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item.email}</td>
                                                <td>{item.firstName}</td>
                                                <td>{item.lastName}</td>
                                                <td>{item.address}</td>
                                                <td className='btn-action'>
                                                    <button
                                                        className='btn-edit'
                                                        onClick={() => this.handleEditUser(item)}
                                                    >
                                                        <i className='fas fa-pencil-alt'></i>
                                                    </button>
                                                </td>
                                                <td className='btn-action'>
                                                    <button
                                                        className='btn-delete'
                                                        onClick={() => this.handleDeleteUser(item)}
                                                    >
                                                        <i className='fas fa-trash'></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6">Chưa có dữ liệu</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        listUsers: state.admin.users
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        deleteUserRedux: (id) => dispatch(actions.deleteUser(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser)
