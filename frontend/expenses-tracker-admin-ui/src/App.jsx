import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import { ToastContainer, Slide } from 'react-toastify';
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
  const { user, loading } = useContext(UserContext);
  
  if (loading && (user === undefined || user === null)) {
    return (
      <div className="spinner-border m-5" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    )
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace/>}/>
          <Route path="/login" element={!user ? <Login/> : <Navigate to="/" replace/>}/>
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </>
  );
}

export default App;
