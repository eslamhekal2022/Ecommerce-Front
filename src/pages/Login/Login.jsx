import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './login.css';
import { setUserRedux } from "../../Redux/user.js";
import { useDispatch } from "react-redux";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const dispatch=useDispatch()
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://e0863ebc-858b-47b1-85ab-0f762bef5906-00-1s5jiyi0pdzpm.kirk.replit.dev/login`, user);
      if (res.data?.success) {
        localStorage.setItem("token",res.data.token)
        localStorage.setItem("userId",res.data.user.id)
        const dataUser=res.data.user
        dispatch(setUserRedux(dataUser))
        localStorage.setItem("user", JSON.stringify(dataUser));
navigate("/")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="register-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
    
    
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          required
        />
        <button className="sub-Auth" type="submit">Login</button>
      </form>
      <p className="PAuth">if you don't have an account please        <Link className="GoAuth" to={"/register"}>click here</Link>
      </p>      
    </div>
  );
};

export default Login;
