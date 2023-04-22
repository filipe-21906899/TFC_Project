import React, {useState} from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
//import {AuthContext} from '../helpers/AuthContext';

function Login() {

  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  //const {setAuthState} = useContext(AuthContext);

  const go = useNavigate();

  const login = (event) => {
    event.preventDefault();
    const data = {Username: Username, Password: Password};
    axios.post("http://localhost:3001/users/login", data).then((response) =>{
      if(response.data.error){
        alert (response.data.error);
      }else{
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("usersTypeId", response.data.UsersTypeId);
        go('/');
        window.location.reload('/');
      }
    });
  };

  return (
    <div className="login">
     <form className='loginContainer'>
        <label>Username:</label>
        <input 
        type="username" 
        onChange={(event) => {setUsername(event.target.value)
        }}
        />
        <label >Password:</label>
        <input 
        type="Password" 
        onChange={(event) => {setPassword(event.target.value)
        }}
        />
        <button onClick={login}>Login</button>
     </form>
   </div>
  )
}

export default Login