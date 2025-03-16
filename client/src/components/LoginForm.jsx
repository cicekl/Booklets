import React, { useState } from "react";
import '../styles/Forms.css'
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginForm() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({...formData, 
            [e.target.name]: e.target.value});
    }

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/login", formData);
            localStorage.setItem("email", response.data.email);
            navigate("/dashboard");
        } catch(error) {
            setError(error.response?.data?.message || "Login failed");
        } 
    }

    return (
        <div className="loginBox">
            <form onSubmit={handleLogin} className="logInForm">
                <div className="inputGroup">
                    <label htmlFor="eMail">E-mail</label>
                    <input type="email" id="email" name="email" className="inputField" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
                </div>

                <div className="inputGroup">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" className="inputField" value={formData.password} onChange={handleChange} placeholder="Enter your password" />
                </div>

                {error && <p className="error">{error}</p>}

                <button type="submit" className="logInBtn">LOG IN</button>
            </form>
        </div>
    );
}

export default LoginForm;