import "../login/login.css";
import React, { useState } from "react";
import axios from "axios";

const Login = ({ setSignet }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitted = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "login" : "register";
      const requestData = isLogin 
        ? { email, password } 
        : { name, email, password };

      const res = await axios.post(`http://localhost:4000/api/auth/${endpoint}`, requestData);
      
      if (isLogin) {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          if (res.data.id) {
            localStorage.setItem("userId", res.data.id);
          }
          setSignet(true);
          window.location.href = "/";
        }
      } else {
        alert("Muvaffaqiyatli ro'yxatdan o'tdingiz! Endi profilingizga kiring.");
        setIsLogin(true);
        setName("");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Xatolik yuz berdi! Ma'lumotlarni qayta tekshiring.");
    }
  };

  return (
    <div className="cyber-wrap">
      <div className="login-sec">
        <form className="login-form" onSubmit={submitted}>
          <h1>CYBER</h1>
          <h2>{isLogin ? "Log-in to your account" : "Create an account"}</h2>
          
          {!isLogin && (
            <label>
              Name
              <input
                className="username-inp"
                type="text"
                placeholder="Ismingizni kiriting"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              className="username-inp"
              type="email"
              placeholder="Email kiriting"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              className="pass-inp"
              type="password"
              placeholder="Parol kiriting"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button className="log-in" type="submit">
            {isLogin ? "Log-in" : "Sign-up"}
          </button>

          <p className="toggle-auth-text">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="toggle-auth-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Register here" : "Login here"}
            </span>
          </p>

          {isLogin && (
            <p className="res-pass">
              Reset password{" "}
              <span className="for-pass">Forgot your password ?</span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;