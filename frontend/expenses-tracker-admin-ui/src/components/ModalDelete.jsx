import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify';

import customAxios from '../custom/axios';
import { defaultUser } from './Constants';
import { UserContext } from '../context/UserContext';

function ModalDelete(props) {
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useContext(UserContext);

    function handleSubmit(e) {
        e.preventDefault();

        let token = localStorage.getItem("token");        
        if(!token){
            document.getElementById("deleteModalCloseBtn").click();
            toast.error('Please login to continue.');
            setUser(null);
            return;
        }

        setIsLoading(true);
        customAxios.delete(`/api/v1/User/${props.selectedUser.id}`, {
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        })
        .then(function (response) {
            toast.info(`User (${props.selectedUser.name}) deleted.`);
            document.getElementById("deleteModalCloseBtn").click();
            props.fetchUsers();
        })
        .catch(function (error) {
            if(error.response?.status === 401){
                toast.info('Please login again to continue.');

                document.getElementById("deleteModalCloseBtn").click();

                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                setUser(null);
            }else{
                if(error.response?.status < 500){
                    toast.error(error.response?.data);    
                }else{
                    toast.error(`An error occured while deleting user: ${props.selectedUser.name}. Please try again.`);
                }
            }
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    function resetModal(){
        props.setSelectedUser(defaultUser);
    }

  return (
    <div className="modal fade" id="modalDelete" tabIndex="-1" aria-labelledby="modalDeleteLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" >
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="modalDeleteLabel">Delete User</h5>
                    <button id="deleteModalCloseBtn" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={resetModal}></button>
                </div>
                <div className="modal-body">
                    <div className='text-center py-2'>
                        <h5>Are you sure you want to delete this user?</h5>
                        <h5 className='mt-4'><i className="fa-solid fa-user fa-xs me-2"></i>{props.selectedUser.name}</h5>
                        <h6><i className="fa-solid fa-envelope fa-xs me-2"></i>{props.selectedUser.email}</h6>
                    </div>
                </div>
                <div className="modal-footer d-flex justify-content-center gap-3">
                    <button type="button" className="btn btn-danger" onClick={handleSubmit} disabled={isLoading}>
                        {
                            isLoading ? 
                            <>
                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            <span role="status"> Processing...</span>
                            </>
                            :
                            <>
                            <i className="fa-solid fa-trash fa-xs me-1"></i>Delete
                            </>
                        }
                    </button>
                    <button className="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close" onClick={e => {e.preventDefault(); resetModal()}} disabled={isLoading}><i className="fa-solid fa-xmark fa-xs me-1"></i>Cancel</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ModalDelete