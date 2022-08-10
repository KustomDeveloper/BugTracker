import React, {useEffect, useState} from "react"
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {logInUser} from '../actions';

const LoginForm = () => {
    const navigate = useNavigate();
    const isLoggedIn = useSelector(state => state.auth);
    const dispatch = useDispatch(); 

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if(isLoggedIn === true) {
            navigate('/dashboard')
        }
    }, [isLoggedIn])

    const handleFormSubmit = (e) => {
        e.preventDefault();

        axios({
            method: 'post',
            url: '/login_user',
            data: {
                username: username,
                password: password
            }
        })
        .then(res => {
            if(res.data.error) {
                setErrors(res.data.error);
            }

            if(res.data.success === true) {
                if(res.data.accessToken) { 
                    (async () => {
                        const setToken = localStorage.setItem('token', res.data.accessToken);
                        dispatch(logInUser());
                    })()
              
                } else {
                    setErrors(["No Token"]);
                }
            }
            
          })
        }
 
        return( 
                <div className="login">
                    <h1>Login</h1>
                    <form onSubmit={handleFormSubmit}>
                        <label>
                        <i className="fa fa-user-o" aria-hidden="true"></i>
                        </label>
                        <input type="text" name="username" 
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Username" id="username" required />

                        <label>
                        <i className="fa fa-unlock-alt" aria-hidden="true"></i>
                        </label>
                        <input type="password" name="password"  
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Password" id="password" required />

                        <div className="alert">{errors}</div>

                        <input type="submit" value="Login" />
                    </form>

                    <Link className="register-link" to="/register"><small>Register &#129046;</small></Link>
                </div>

        )

}

export default LoginForm
		
