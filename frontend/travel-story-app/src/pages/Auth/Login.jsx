import React, { useState } from 'react'
import PasswordInput from '../../components/Input/PasswordInput'
import {useNavigate} from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import  axiosInstance from '../../utils/axiosInstance'
import './Login.css'



const Login = () => {

  
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState(null)

  const navigate = useNavigate()

  const handleLogin = async(e)=>{
         
     e.preventDefault();

     if(!validateEmail(email)){

        setError("Please enter a valid email address.");
        return; 
     }

     if(!password){
      
        setError("Please enter the password")
        return;
     }

     setError("")


     // Login api call 

       try{

        const response = await axiosInstance.post("/login",{
          email:email,
          password:password,
        })


       // Handle successful login response 

       if(response.data && response.data.accessToken){
       
          localStorage.setItem("token",response.data.accessToken)
          navigate("/dashboard")
       }


      } catch(error){

        if(error.response&&
          error.response.data &&
          error.response.data.message
        ){

          setError(error.response.data.message)
        }

        else{

          setError("An unexpected error occurred please try again")
        }
         

      }
     
     };

  return (
    <div className='h-screen bg-cyan-100 overflow-hidden relative'>

     <div className='login-ui-box  right-10 -top-40 hidden sm:block'/>
     <div className='login-ui-box bg-cyan-200 -bottom-40 right-1/2 hidden sm:block'/>

      <div className="container h-screen flex flex-col lg:flex-row items-center justify-center px-4 lg:px-20 my-auto">
        <div className="w-full lg:w-2/4 h-[40vh] lg:h-[90vh] flex items-end login-bagha bg-cover bg-center rounded-lg p-6 lg:p-10 z-50">
          <div>
            <h4 className="text-3xl lg:text-5xl text-white font-semibold leading-tight lg:leading-[58px]">
             Capture Your <br/> Journeys 
            </h4>
            <p className=" text-sm lg:text-xl text-white leading-5 lg:leading-6 pr-4 lg:pr-7 mt-2 lg:mt-4">
             Record your travel experiences and memories in your personal travel journal.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-2/4 h-auto lg:h-[75vh] bg-white rounded-lg lg:rounded-r-lg relative p-8 lg:p-16 shadow-cyan-200/20">
          <form onSubmit={handleLogin} action="">
            <h4 className="text-xl lg:text-2xl font-semibold mb-5 lg:mb-7">Login</h4>
            
            <input type="text" placeholder='email' className='input-box w-full mb-4' 
            value={email}
            onChange={({target})=>{setEmail(target.value)}}
            />

            <PasswordInput
              value={password}
             onChange={({target})=>{ setPassword(target.value)}}
            
            />


              {error&& <p className='text-red-500 text-sm py-2' >{error}</p>}

            <button type='submit' className='btn-primary'>
              LOGIN
            </button>
        
             <p className="text-xs text-slate-500 text-center my-4">Or</p>
 
            <button type='submit' className='btn-primary btn-light' onClick={()=>{navigate("/signup")}}>
            CREATE ACCOUNT
            </button>      

          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
