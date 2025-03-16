import React, { useState } from "react";
import '../styles/Forms.css'
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterForm() {

    const navigate = useNavigate();

    const[formData,setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const[error,setError] = useState("");

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };


    const handleRegister = async (event) => {

        event.preventDefault();


        try {
            const response = await axios.post("http://localhost:8080/register", formData);
            localStorage.setItem("email", response.data.email);
            setFormData({ username: "", email: "", password: "" });
            navigate("/dashboard");
        } catch(error) {
            setError(error.response?.data?.message || "An error occurred");
        } 
    };

    return (
        <div className="loginBox">
            <div className="registerForm">
                <form onSubmit={handleRegister} className="logInForm">

                    <div className="inputGroup">
                        <label>Username</label>
                        <input type="text" className="inputField" id="uName" name="username" value={formData.username} onChange={handleChange} placeholder="Enter your username" required></input>
                    </div>

                    <div className="inputGroup">
                        <label>E-mail</label>
                        <input type="email" className="inputField" id="eMail" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required></input>
                    </div>

                    <div className="inputGroup">
                        <label>Password</label>
                        <input type="password" className="inputField" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required></input>
                    </div>

                    {error && <p className="error">{error}</p>}

                    <button type="submit" className="registerBtn">REGISTER</button>
                </form>
            </div>
        </div>
    );
}

export default RegisterForm;