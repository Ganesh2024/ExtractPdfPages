import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export const  Login = ()=> {
  const navigate = useNavigate();
  const url = "https://extractpdfpages.onrender.com";
  // const url = "http://localhost:8000";
  
  const handleSubmit = async (e)=>{
    try {
      e.preventDefault(); //to stop refreshing page

      const Data = new FormData(e.currentTarget);
      const userData = {
        email: Data.get("email"),
        password: Data.get("password")
      }

      if(userData.email=="" || userData.password==""){
        alert('all inputs are required');
        return;
      }

      const {data} = await axios.post(url+"/login",userData);
      // console.log(data.user._id);

      if(data.status==200){
        localStorage.setItem("userId",JSON.stringify({userId:data.user._id}));
        navigate('/uploadPdf');
        return;
      }

      alert(data.msg);
      // console.log(data);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className='login-page'>
      <div className='login-box'>
        <h3>in Login page</h3>
        <form className='loginForm' onSubmit={handleSubmit}>
          <input type='email' placeholder='Enter email' id='email' name='email'
          style={{
            "borderRadius": "0.3rem",
          }}></input>

          <input type='password' placeholder='Enter password' id='password' name='password'
          style={{
            "border-radius": "0.3rem",
          }}></input>

          <button type='submit' id="submit" >submit</button>
        </form>
        <a onClick={()=>navigate('/register')} style={{"cursor":"pointer"}}>Create your account</a>
      </div>
    </div>
  )
}
