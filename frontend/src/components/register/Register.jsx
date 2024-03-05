import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./Register.css"

export const Register=()=> {
  const navigate = useNavigate();
  const url = "http://localhost:8000";
  const handleSubmit = async (e)=>{
    try {
      e.preventDefault();

      const Data = new FormData(e.currentTarget);
      const userData = {
        email: Data.get("email"),
        password: Data.get("password"),
        confirmPassword: Data.get("confirmPassword")
      }

      if(userData.email=="" || userData.password=="" || userData.confirmPassword==""){
        alert("all the input fields are required!!");
        return;
      }

      if(userData.password!=userData.confirmPassword){
        alert("password didn't matched with confirmPassword");
        return;
      }

      const {data} = await axios.post(`${url}/register`,userData);
      // console.log(data.user._id);

      if(data.status==200){
        localStorage.setItem("userId",JSON.stringify({userId:data.user._id}));
        navigate('/uploadPdf');
        return;
      }

      alert(data.msg);
      console.log("in register",data.msg);
    } catch (err) {
      console.log(err); 
    }
  }
  return (
    <div className='register-page'>
      <div className='register-box'>
        <h3>in register page</h3>
        <form className='registerForm' onSubmit={handleSubmit}>
          <input type='email' name='email' placeholder='Enter email' id='email'
          style={{
              "border-radius": "0.3rem",
          }}>
          </input>

          <input type='password' name='password' placeholder='Enter password' id='password'
          style={{
            "border-radius": "0.3rem",
          }}
          ></input> 

          <input type='password' name='confirmPassword' placeholder='conform Password' id='confirmPassword'
          style={{
            "border-radius": "0.3rem",
          }}
          ></input>

          <button type='submit' id="submit" >submit</button>
        </form>
        <a onClick={()=>navigate('/login')} style={{"cursor":"pointer"}}>Already user?</a>
      </div>
    </div>
  )
}
