import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import customAxios from "../custom/axios";
import Table from "../components/Table";
import Navbar from "../components/Navbar";
import ModalCreate from "../components/ModalCreate";
import ModalUpdate from "../components/ModalUpdate";
import ModalDelete from "../components/ModalDelete";
import Footer from "../components/Footer";
import { defaultUser } from "../components/Constants";
import { UserContext } from "../context/UserContext";

function Home() {
  const {user, setUser} = useContext(UserContext);
  
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(defaultUser);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers(){
    let token = localStorage.getItem("token");
    if(!token){
      toast.error('Please login to continue.');
      setUser(null);
      return;
    }

    setIsLoading(true);
    customAxios.get("/api/v1/User", {
      headers: {
          "Authorization" : `Bearer ${token}`
        }
      })  
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        if(error.response?.status === 401){
          handleLogout();
          toast.info('Please login again to continue.');
        }else{
          toast.error('An error occured while fetching the user list.');
        }
      })
      .finally(() => {
        setIsLoading(false)
      });
  }

  function handleLogout(){
    setIsLoading(true);
    axios.post( import.meta.env.VITE_API_BASE_URL + "/api/v1/Account/Logout", {
      id: user.id
    })
      .then((response) => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setUser(null);
      })
      .catch((error) => {
        toast.error("An unexpected error occured while logging out. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div>
      <Navbar handleLogout={handleLogout}/>
      <Table users={users} setSelectedUser={setSelectedUser} isLoading={isLoading} />
      <ModalCreate fetchUsers={fetchUsers} />
      <ModalUpdate selectedUser={selectedUser} setSelectedUser={setSelectedUser} fetchUsers={fetchUsers}/>
      <ModalDelete selectedUser={selectedUser} setSelectedUser={setSelectedUser} fetchUsers={fetchUsers}/>
      <Footer />
    </div>
  );
}

export default Home;