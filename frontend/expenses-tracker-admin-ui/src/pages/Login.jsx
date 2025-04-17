import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import validator from "validator";
import axios from "axios";

import LoginForm from "../components/LoginForm";
import { UserContext } from "../context/UserContext";
import Footer from "../components/Footer";

function Login() {
  const {setUser} = useContext(UserContext);
  const [loginUser, setLoginUser] = useState({
    username: "",
    password: "",
    isPersistent: false,
  });
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleLogin(e) {
    e.preventDefault();

    if (isValid()) {
      setIsLoading(true);
      axios.post( import.meta.env.VITE_API_BASE_URL + "/api/v1/Account/Login", loginUser)
        .then((response) => {
          toast.info("Login Successful.");
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          let payload = jwtDecode(response.data.token);
          setUser({ name: payload.user_name, email: payload.user_email, id: payload.sub})
        })
        .catch((error) => {
          if(error.response?.status < 500){
            toast.error(error.response?.data);
          }else{
            toast.error("An unexpected error occured while logging in. Please try again.");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  function isValid() {
    let newErrors = null;

    // username
    if (!validator.isEmail(loginUser.username)) {
      newErrors = { ...newErrors, username: "Username must be a valid email." };
    }
    if (!validator.isLength(loginUser.username, { min: 8, max: 255 })) {
      newErrors = {
        ...newErrors,
        username: "Username must be 8 to 255 characters.",
      };
    }
    if (validator.isEmpty(loginUser.username, { ignore_whitespace: true })) {
      newErrors = { ...newErrors, username: "Username must not be empty." };
    }

    // password
    if (!validator.isLength(loginUser.password, { min: 8, max: 255 })) {
      newErrors = {
        ...newErrors,
        password: "Password must be 8 to 255 characters.",
      };
    }
    if (validator.isEmpty(loginUser.password, { ignore_whitespace: true })) {
      newErrors = { ...newErrors, password: "Password must not be empty." };
    }

    setErrors(newErrors);

    return newErrors === null;
  }

  return (
    <div>
      <LoginForm
        handleLogin={handleLogin}
        loginUser={loginUser}
        setLoginUser={setLoginUser}
        errors={errors}
        isLoading={isLoading}
      />
      <Footer />
    </div>
  );
}

export default Login;
