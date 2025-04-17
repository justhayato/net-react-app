import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import logo from '/img/Logo-Light.png'
import pp from '/img/User-Default.png'
import { version } from './Constants'

function Navbar(props) {
    const {user} = useContext(UserContext);

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="container">
            <a className="navbar-brand" href="/">
                <img src={`${logo}?v=${version}`} alt="Expenses Tracker Admin Logo" className="img-fluid" style={{ maxWidth: "40px", marginRight: "8px"}}></img>
                Expenses Tracker - Admin
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-toggle"
                aria-controls="navbar-toggle" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbar-toggle">
                <ul className="navbar-nav me-auto mb-2 mb-sm-0">
                    <li className="nav-item">
                        <a className="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#modalCreate">Add User</a>
                    </li>
                </ul>

                <ul className="navbar-nav ms-auto mb-2 mb-sm-0">
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <img src={`${pp}?v=${version}`} alt="Default User Icon" className="rounded-circle mx-2" width="25"/>
                            {user && user.name}
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="userDropdown">
                            <li><a className="dropdown-item btn" onClick={props.handleLogout} disabled><i className="fa-solid fa-right-from-bracket fa-xs me-1"></i>Logout</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  )
}

export default Navbar
