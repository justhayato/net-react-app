import React from 'react'
import moment from 'moment'

function Table(props) {
  return (
    <div className="container my-4">
        <h4 className="mb-3"><i className="fa-solid fa-users fa-xs me-2"></i>Users</h4>

        { props.isLoading ? 
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            : 
            <div className="table-responsive-sm">
                <table className="table table-bordered table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Date Created</th>
                            <th>Last Update</th>
                            <th className="text-center" style={{width: "100px"}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.createDt && moment(user.createDt).format("MM-DD-YYYY hh:mm A")}</td>
                                <td>{user.updateDt === null ? (<em>not yet updated</em>) : moment(user.updateDt).format("MM-DD-YYYY hh:mm A")}</td>
                                <td className="text-center" style={{width: "100px", whiteSpace: "nowrap"}}>
                                    <div className="d-flex justify-content-between" style={{minWidth: "100px"}}>
                                        <button className="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#modalUpdate" onClick={() => props.setSelectedUser(user)}><i className="fa-solid fa-pen fa-xs me-1"></i>Update</button>
                                        <button className="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#modalDelete" onClick={() => props.setSelectedUser(user)}><i className="fa-solid fa-trash fa-xs me-1"></i>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        }
    </div>
  )
}

export default Table
