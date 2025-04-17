import React from 'react'
import logo from '/img/Logo-Dark.png'
import { version } from './Constants';

function LoginForm(props) {
    function generateClassName(inputName){
        if(props.errors && Object.keys(props.errors).includes(inputName)){
            return "form-control is-invalid";
        }
        return "form-control";
    }

  return (
    <div>
      <div className="container text-center mt-3">
            <img src={`${logo}?v=${version}`} alt="Expenses Tracker Admin Logo" className="img-fluid" style={{ maxWidth:"200px"}} />
            <h1 className="fw-bold">Expenses Tracker - Admin</h1>
        </div>

        <div className="container d-flex justify-content-center align-items-center mt-5">
            <div className="card shadow p-4" style={{ width: "100%", maxWidth: "500px"}}>
                <h2 className="text-center mb-4">Sign In</h2>
                <form noValidate>
                    <div className="mb-3">
                        <i className="fa-solid fa-envelope fa-xs me-1"></i><label htmlFor="email" className="form-label">Username</label>
                        <input type="email" className={generateClassName("username")} id="email" placeholder="Enter Email" value={props.loginUser.username} onChange={e => props.setLoginUser({ ...props.loginUser, username: e.target.value })}/>
                    </div>

                    <div className="mb-3">
                        <i className="fa-solid fa-lock fa-xs me-1"></i><label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className={generateClassName("password")} id="password" placeholder="Enter Password" value={props.loginUser.password} onChange={e => props.setLoginUser({ ...props.loginUser, password: e.target.value })}/>
                    </div>

                    <div className="d-flex justify-content-between align-items-center invisible">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="rememberMe" checked={props.loginUser.isPersistent} onChange={() => props.setLoginUser({...props.loginUser, isPersistent : !props.loginUser.isPersistent})}/>
                            <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                        </div>
                        <a href="#" className="text-decoration-none">Forgot password?</a>
                    </div>

                    {
                        props.errors && 
                        <div id="errorBox" className="alert alert-danger p-2 mt-3" role="alert">
                            <ul className="my-1" style={{ listStyleType: "none", paddingLeft: "10px", fontSize: ".8rem"}}>
                                {Object.values(props.errors).map((msg, index) => (
                                    <li key={index}><i className="fa-solid fa-circle-xmark fa-xs"></i> {msg}</li>
                                ))}
                            </ul>
                        </div>
                    }
                    
                    <div className="d-flex justify-content-center gap-3 mt-3">
                        <button type="submit" className="btn btn-primary" onClick={e => props.handleLogin(e)} disabled={props.isLoading}>
                            {
                                props.isLoading ? 
                                <>
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                <span role="status"> Signing In...</span>
                                </>
                                :
                                <>
                                <i className="fa-solid fa-right-to-bracket fa-xs me-1"></i>Sign In
                                </>
                            }
                            
                        </button>
                    </div>

                    <p className="text-center mt-3 d-none">
                        Don't have an account? <a href="register.html">Register</a>
                    </p>
                </form>
            </div>
        </div>
    </div>
  )
}

export default LoginForm
