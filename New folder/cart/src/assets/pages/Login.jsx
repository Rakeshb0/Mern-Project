import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { CartContext } from './context/CartContext';
import { FcGoogle } from 'react-icons/fc';

import mainImg from '../images/LoginImg.png';
import mystyle from './css/Loginmain.module.css';

const Login = () => {
    const { token, setToken, backendUrl } = useContext(CartContext);
    const [isLogin, setLogin] = useState(true);
    const [message, setMessage] = useState('Welcome Back!');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 

    const handleLogin = async (event) => {
        event.preventDefault();
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const res = await fetch(`${backendUrl}/verse/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            console.log(data)
            if (!data) {
                alert('Login failed');
                return;
            }

            console.log(data.token.access.token);
            setToken(data.token.access.token);
            localStorage.setItem('token', data.token.access.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/products'); 
        } catch (error) {
            console.error('Login Error:', error);
            alert('Something went wrong. Try again.');
        }
    };

    const handleSignup = async (event) => {
        event.preventDefault();
        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const res = await fetch(`${backendUrl}/verse/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();

            if (data.error) {
                alert(data.error.message || 'Signup failed');
                return;
            }

            setToken(data.token.access.token);
            localStorage.setItem('token', data.token.access.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/products'); 
        } catch (error) {
            console.error('Signup Error:', error);
            alert('Something went wrong. Try again.');
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            navigate('/products'); 
        }
    }, []);

    const handleToggle = () => {
        setLogin((prev) => !prev);
        setMessage(isLogin ? 'Register Now' : 'Welcome Back!');
    };

    return (
        <div className={mystyle.mainDiv}>
            <div className={mystyle.inputDiv}>
                <h1>{message}</h1>
                <form className={mystyle.inpContainer} onSubmit={isLogin ? handleLogin : handleSignup}>
                    {!isLogin && (
                        <div className={mystyle.input_box}>
                            <i className="fas fa-user"></i>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className={mystyle.input_box}>
                        <i className="fas fa-envelope"></i>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={mystyle.input_box}>
                        <i className="fas fa-lock"></i>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className={mystyle.lgn_btn} type="submit">
                        {isLogin ? 'Login' : 'Signup'}
                    </button>
                </form>

                <div className={mystyle.or}>
                    <hr className={mystyle.line} />
                    <p>Or</p>
                    <hr className={mystyle.line} />
                </div>

                

                <div className={mystyle.sup}>
                    {isLogin ? (
                        <p>
                            Don't have an account?{' '}
                            <button className={mystyle.signup} onClick={handleToggle}>
                                Sign Up
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <button className={mystyle.signup} onClick={handleToggle}>
                                Login
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;