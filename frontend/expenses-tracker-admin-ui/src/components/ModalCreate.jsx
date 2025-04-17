import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify';
import validator from 'validator';

import customAxios from '../custom/axios';
import { defaultUser } from './Constants';
import { UserContext } from '../context/UserContext';

function ModalCreate(props) {
    const [newUser, setNewUser] = useState(defaultUser)
    const [errors, setErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useContext(UserContext);

    function handleSubmit(e) {
        e.preventDefault();

        let token = localStorage.getItem("token");
        if(!token){
            document.getElementById("createModalCloseBtn").click();
            toast.error('Please login to continue.');
            setUser(null);
            return;
        }

        if(isValid()){
            setIsLoading(true);
            customAxios.post('/api/v1/User', newUser, {
                headers: {
                    "Authorization" : `Bearer ${token}`
                }
            })
              .then(function (response) {
                toast.info('New user created.');
                document.getElementById("createModalCloseBtn").click();
                props.fetchUsers();
              })
              .catch(function (error) {
                if(error.response?.status === 401){
                    toast.info('Please login again to continue.');
                    
                    document.getElementById("createModalCloseBtn").click();

                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    setUser(null);
                }else{
                    if(error.response?.status < 500){
                        toast.error(error.response?.data);    
                    }else{
                        toast.error('An unexpected error occured while creating a new user. Please try again.');
                    }
                }
              })
              .finally(() => {
                setIsLoading(false);
              });
        }
    }

    function isValid(){
        let newErrors = null;

        // name 
        if(!validator.isLength(newUser.name, { min: 8, max: 255 })){
            newErrors = {...newErrors, name : "Full Name must be 8 to 255 characters."};
        }
        if(validator.isEmpty(newUser.name, { ignore_whitespace: true})){
            newErrors = {...newErrors, name : "Full Name must not be empty."};
        }

        // email
        if(!validator.isEmail(newUser.email)){
            newErrors = {...newErrors, email : "Email Address must be a valid email."};
        }
        if(!validator.isLength(newUser.email, { min: 8, max: 255 })){
            newErrors = {...newErrors, email : "Email Address must be 8 to 255 characters."};
        }
        if(validator.isEmpty(newUser.email, { ignore_whitespace: true})){
            newErrors = {...newErrors, email : "Email Address must not be empty."};
        }

        // phone
        if(!validator.isMobilePhone(newUser.phone)){
            newErrors = {...newErrors, phone : "Phone Number must be a valid mobile number."};
        }
        if(!validator.isLength(newUser.phone, { max: 255 })){
            newErrors = {...newErrors, phone : "Phone Number must not exceed 255 characters."};
        }
        if(validator.isEmpty(newUser.phone, { ignore_whitespace: true})){
            newErrors = {...newErrors, phone : "Phone Number must not be empty."};
        }

        // password
        if(!validator.isStrongPassword(newUser.password)){
            newErrors = {...newErrors, password : "Password must have atleast 8 characters and have atleast 1 uppercase character, 1 lowercase character, a number and a symbol."};
        }
        if(!validator.isLength(newUser.password, { max: 255 })){
            newErrors = {...newErrors, password : "Password must not exceed 255 characters."};
        }
        if(validator.isEmpty(newUser.password, { ignore_whitespace: true})){
            newErrors = {...newErrors, password : "Password must not be empty."};
        }

        // confirm password
        if(!validator.equals(newUser.confirmPassword, newUser.password)){
            newErrors = {...newErrors, confirmPassword : "Confirm Password must be same with given Password."};
        }
        if(validator.isEmpty(newUser.confirmPassword, { ignore_whitespace: true})){
            newErrors = {...newErrors, confirmPassword : "Confirm Password must not be empty."};
        }

        setErrors(newErrors);

        return newErrors === null;
    }

    function generateClassName(inputName){
        if(errors && Object.keys(errors).includes(inputName)){
            return "form-control is-invalid";
        }
        return "form-control";
    }

    function resetModal(){
        setNewUser(defaultUser);
        setErrors(null);
    }

  return (
    <div className="modal fade" id="modalCreate" tabIndex="-1" aria-labelledby="modalCreateLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" >
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="modalCreateLabel">Add New User</h5>
                    <button id="createModalCloseBtn" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={resetModal}></button>
                </div>
                <form className="px-3" onSubmit={e => handleSubmit(e)} noValidate>
                    <div className="modal-body">
                            <div className="mb-3">
                                <i className="fa-solid fa-user fa-xs me-1"></i><label htmlFor="name" className="form-label">Full Name</label>
                                <input type="text" className={generateClassName("name")} id="name-c" placeholder="Enter full name" value={newUser.name} onChange={(e) => setNewUser({...newUser, name : e.target.value})} required/>
                            </div>
                            
                            <div className="mb-3">
                                <i className="fa-solid fa-envelope fa-xs me-1"></i><label htmlFor="email" className="form-label">Email Address</label>
                                <input type="email" className={generateClassName("email")} id="email-c" placeholder="Enter email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email : e.target.value})} required/>
                            </div>

                            <div className="mb-3">
                                <i className="fa-solid fa-phone fa-xs me-1"></i><label htmlFor="phone" className="form-label">Phone Number</label>
                                <input type="tel" className={generateClassName("phone")} id="phone-c" placeholder="Enter phone number" value={newUser.phone} onChange={(e) => setNewUser({...newUser, phone : e.target.value})} required/>
                            </div>

                            <div className="mb-3">
                                <i className="fa-solid fa-lock fa-xs me-1"></i><label htmlFor="password" className="form-label">Password</label>
                                <input type="password" className={generateClassName("password")} id="password-c" placeholder="Enter password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password : e.target.value})} required/>
                            </div>

                            <div className="mb-3">
                                <i className="fa-solid fa-circle-check fa-xs me-1"></i><label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                <input type="password" className={generateClassName("confirmPassword")} id="confirmPassword-c" placeholder="Confirm password" value={newUser.confirmPassword} onChange={(e) => setNewUser({...newUser, confirmPassword : e.target.value})} required/>
                            </div>

                            <div className="mb-3">
                                <i className="fa-solid fa-users fa-xs me-1"></i><label className="form-label">Role</label>
                                <div className="d-flex gap-3">
                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="role" id="role-user" value={10} required checked={newUser.role === 10} onChange={(e) => setNewUser({...newUser, role : 10})} />
                                    <label className="form-check-label" htmlFor="role-user">User</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="role" id="role-admin" value={20} required checked={newUser.role === 20} onChange={(e) => setNewUser({...newUser, role : 20})} />
                                    <label className="form-check-label" htmlFor="role-admin">Admin</label>
                                    </div>
                                </div>
                            </div>

                            {
                                errors && 
                                <div id="errorBox" className="alert alert-danger p-2" role="alert">
                                    <ul className="my-1" style={{ listStyleType: "none", paddingLeft: "10px", fontSize: ".8rem"}}>
                                        {Object.values(errors).map((msg, index) => (
                                            <li key={index}><i className="fa-solid fa-circle-xmark fa-xs"></i> {msg}</li>
                                        ))}
                                    </ul>
                                </div>
                            }
                    </div>
                    <div className="modal-footer d-flex justify-content-center gap-3">
                        <button type="submit" className="btn btn-success" disabled={isLoading}>
                            {
                                isLoading ? 
                                <>
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                <span role="status"> Processing...</span>
                                </>
                                :
                                <>
                                <i className="fa-solid fa-plus fa-xs me-1"></i>Add
                                </>
                            }
                            
                        </button>
                        <button className="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close" onClick={e => {e.preventDefault(); resetModal()}} disabled={isLoading}><i className="fa-solid fa-xmark fa-xs me-1"></i>Close</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default ModalCreate
