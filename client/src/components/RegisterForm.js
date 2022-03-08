import React, {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {logInUser} from '../actions';

const RegisterForm = () => {
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

        const formFields = {
            name: username,
            password: password
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
           
            body: JSON.stringify(formFields)
        };

        fetch('/add_user', requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.success === false) {
                if(data.errors) {
                    return setErrors(data.errors);
                }
                if(data.single_error) {
                    return setErrors([data.single_error]);
                } 
            }
          
            if(data.success === true) {   
              setErrors([]);

                if(data.accessToken) { 
                    localStorage.setItem('token', data.accessToken);
                    dispatch(logInUser());
                }  else {
                    setErrors(["No Token"])
                }

            }

        })
    }
        return( 
                <div className="login register">
                    <h1>Register</h1>
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
                       
                            {errors ? errors.map((item, key) => (
                               <div className="alert" key={key}>{item}</div>
                            )) : null}
                       
                        <input type="submit" value="Register" />
                    </form>

                    <Link className="register-link" to="/"><small>Login &#129046;</small></Link>
                </div>
        )

}

export default RegisterForm;
		
