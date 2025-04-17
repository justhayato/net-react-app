import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify';
import validator from 'validator';

import customAxios from '../custom/axios';
import { defaultUser } from './Constants';
import { UserContext } from '../context/UserContext';


function ModalUpdate(props) {
    const [errors, setErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useContext(UserContext);

    function handleSubmit(e) {
        e.preventDefault();

        let token = localStorage.getItem("token");
        if(!token){
            document.getElementById("updateModalCloseBtn").click();
            toast.error('Please login to continue.');
            setUser(null);
            return;
        }

        if(isValid()){
            setIsLoading(true);
            customAxios.patch('/api/v1/User', props.selectedUser, {
                headers: {
                    "Authorization" : `Bearer ${token}`
                }
            })
              .then(function (response) {
                toast.info(`User (${props.selectedUser.name}) updated.`);
                document.getElementById("updateModalCloseBtn").click();
                props.fetchUsers();
              })
              .catch(function (error) {
                if(error.response?.status === 401){
                    toast.info('Please login again to continue.');
                    
                    document.getElementById("updateModalCloseBtn").click();

                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    setUser(null);                    
                }else{
                    if(error.response?.status < 500){
                        toast.error(error.response?.data);    
                    }else{
                        toast.error(`An error occured while updating user: ${props.selectedUser.name}. Please try again.`);
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
        if(!validator.isLength(props.selectedUser.name, { min: 8, max: 255 })){
            newErrors = {...newErrors, name : "Full Name must be 8 to 255 characters."};
        }
        if(validator.isEmpty(props.selectedUser.name, { ignore_whitespace: true})){
            newErrors = {...newErrors, name : "Full Name must not be empty."};
        }

        // email
        if(!validator.isEmail(props.selectedUser.email)){
            newErrors = {...newErrors, email : "Email Address must be a valid email."};
        }
        if(!validator.isLength(props.selectedUser.email, { min: 8, max: 255 })){
            newErrors = {...newErrors, email : "Email Address must be 8 to 255 characters."};
        }
        if(validator.isEmpty(props.selectedUser.email, { ignore_whitespace: true})){
            newErrors = {...newErrors, email : "Email Address must not be empty."};
        }

        // phone
        if(!validator.isMobilePhone(props.selectedUser.phone)){
            newErrors = {...newErrors, phone : "Phone Number must be a valid mobile number."};
        }
        if(!validator.isLength(props.selectedUser.phone, { max: 255 })){
            newErrors = {...newErrors, phone : "Phone Number must not exceed 255 characters."};
        }
        if(validator.isEmpty(props.selectedUser.phone, { ignore_whitespace: true})){
            newErrors = {...newErrors, phone : "Phone Number must not be empty."};
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
        props.setSelectedUser(defaultUser);
        setErrors(null);
    }

  return (
    <div className="modal fade" id="modalUpdate" tabIndex="-1" aria-labelledby="modalUpdateLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" >
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="modalUpdateLabel">Update User</h5>
                    <button id="updateModalCloseBtn" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={resetModal}></button>
                </div>
                <form className="px-3" onSubmit={e => handleSubmit(e)} noValidate>
                    <div className="modal-body">
                            <div className="mb-3">
                                <i className="fa-solid fa-user fa-xs me-1"></i><label htmlFor="name" className="form-label">Full Name</label>
                                <input type="text" className={generateClassName("name")} id="name-u" placeholder="Enter full name" value={props.selectedUser.name} onChange={(e) => props.setSelectedUser({...props.selectedUser, name : e.target.value})} required/>
                            </div>
                            
                            <div className="mb-3">
                                <i className="fa-solid fa-envelope fa-xs me-1"></i><label htmlFor="email" className="form-label">Email Address</label>
                                <input type="email" className={generateClassName("email")} id="email-u" placeholder="Enter email" value={props.selectedUser.email} onChange={(e) => props.setSelectedUser({...props.selectedUser, email : e.target.value})} required/>
                            </div>

                            <div className="mb-3">
                                <i className="fa-solid fa-phone fa-xs me-1"></i><label htmlFor="phone" className="form-label">Phone Number</label>
                                <input type="tel" className={generateClassName("phone")} id="phone-u" placeholder="Enter phone number" value={props.selectedUser.phone} onChange={(e) => props.setSelectedUser({...props.selectedUser, phone : e.target.value})} required/>
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
                        <button type="submit" className="btn btn-warning" disabled={isLoading}>
                            {
                                isLoading ? 
                                <>
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                <span role="status"> Processing...</span>
                                </>
                                :
                                <>
                                <i className="fa-solid fa-pen fa-xs me-1"></i>Update
                                </>
                            }
                        </button>
                        <button className="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close" onClick={e => {e.preventDefault(); resetModal()}} disabled={isLoading}><i className="fa-solid fa-xmark fa-xs me-1"></i>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default ModalUpdate
