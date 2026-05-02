import React, { useContext, useState } from 'react'
import bg from '../assets/authBg.png'
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from "axios"

const SignUp = () => {

  const [showPassword, setShowPassword] = useState(false);
  const {serverUrl,userData,setUserData} = useContext(userDataContext);
  const navigate = useNavigate();
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signup`,{name,email,password},{withCredentials:true});
      setUserData(result.data);
      setLoading(false);
      navigate("/customize");
    } catch (error) {
      console.log(error);
      setUserData(null);
      setErr(error.response.data.message);
      setLoading(false);
    }

  }
  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{backgroundImage:`url(${bg})`}}>
        <form onSubmit={handleSignUp} className='rounded-3xl px-[20px] w-[90%] h-[600px] max-w-[500px] bg-[#00000033] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px]'>
            <h1 className='text-white text-[30px] font-semibold mb-[30px]'>Register to <span className='text-blue-400'>Virtual Assistant</span></h1>
            <input type="text" required onChange={(e)=>setName(e.target.value)} value={name} placeholder='Enter Your Name' className='w-full h-[60px] outline-none border-2 px-[20px] py-[10px] rounded-full text-[18px] border-white bg-transparent text-white placeholder-gray-300' />
            <input type="Email" required onChange={(e)=>setEmail(e.target.value)} value={email} placeholder='Enter Your Email' className='w-full h-[60px] outline-none border-2 px-[20px] py-[10px] rounded-full text-[18px] border-white bg-transparent text-white placeholder-gray-300' />
            <div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
                <input type={showPassword?"text":"password"} required onChange={(e)=>setPassword(e.target.value)} value={password} placeholder='Enter Your Password' className='w-full h-full rounded-full outline-none bg-transparent  placeholder-gray-300 px-[20px] py-[10px]'/>
                {!showPassword && <IoEye className='absolute top-[18px] right-[20px] text-[white] w-[25px] h-[25px] cursor-pointer' onClick={()=>setShowPassword(true)}/>}
                {showPassword && <IoEyeOff className='absolute top-[18px] right-[20px] text-[white] w-[25px] h-[25px] cursor-pointer' onClick={()=>setShowPassword(false)}/>}

                
            </div>
            {err.length > 0 && <p className='text-red-500 text-[17px]'>*{err}
              </p>}
            <button className='min-w-[150px] h-[60px] bg-white rounded-full font-semibold text-[19px] text-black mt-[30px]' disabled={loading} >{loading?"Loading...":"Sign Up"}</button>
            <p className='text-white text-[18px] cursor-pointer' onClick={()=>navigate("/signin")} >Already have an account ? <span className='text-blue-400'>Sign In</span></p>
        </form>
        
    </div>
  )
}

export default SignUp
