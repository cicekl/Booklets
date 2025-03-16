import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import "../styles/Home.css";


function Home() {

    const [isRegistering, setIsRegistering] = useState(false);

    const slideForms = () => {
        setIsRegistering(!isRegistering);
    }

    return (
        <div className="homeBox">
            <div className="leftBox">
                <h1 className="titlePage">{isRegistering ? "Welcome to Booklets!" : "Welcome back!"}</h1>
                <p className="aboutPage">
                    {isRegistering
                        ? "... a place where you can share your own thoughts about read books."
                        : "We missed you! Log in to see the newest thoughts and opinions of our community."}
                </p>
                {isRegistering ? <RegisterForm /> : <LoginForm />}
            </div>

            <div className="rightBox">
                <h1 className="titlePage">{isRegistering ? "Welcome back!" : "Welcome to Booklets!"}</h1>
                <p className="aboutPage">
                    {isRegistering
                        ? "We missed you! Log in to see the newest thoughts and opinions of our community."
                        : "... a place where you can share your own thoughts about read books."}
                </p>
                <button className="switch-btn" onClick={slideForms}>
                    {isRegistering ? "LOG IN" : "REGISTER"}
                </button>
            </div>
        </div>
    );
}

export default Home;