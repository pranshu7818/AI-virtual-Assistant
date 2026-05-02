import React, { useContext, useRef, useState } from 'react'
import { RiImageAddLine } from "react-icons/ri";
import Card from '../components/Card.jsx'
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/authBg.png'
import image4 from '../assets/image4.png'
import image5 from '../assets/image5.png'
import image6 from '../assets/image6.jpeg'
import image7 from '../assets/image7.jpeg'
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from "react-icons/md";

const Customize = () => {
  const {serverUrl, userData, setUserData,backendImage, setBackendImage,frontendImage, setFrontendImage,selectedImage, setSelectedImage} = useContext(userDataContext);

  const navigate = useNavigate();
  const inputImage = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px]'>
      <MdKeyboardBackspace className='absolute top-[30px] left-[30px] w-[25px] h-[25px] text-white cursor-pointer'  onClick={()=>navigate("/")}/>
      <h1 className='text-white text-[30px] text-center mb-[40px]'>Select Your <span className='text-blue-400 '>Assistant Image</span></h1>
      <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[20px]'>
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] flex items-center justify-center border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-800 cursor-pointer hover:border-2 hover:border-white ${selectedImage=="input"?"border-2 border-white shadow-2xl shadow-blue-800":null}`} onClick={()=>{inputImage.current.click()
          setSelectedImage("input")
        }}>
          {!frontendImage && <RiImageAddLine className='text-white w-[25px] h-[25px]' />}
          {frontendImage && <img src={frontendImage} className='h-full object-cover'/>} 
          
        </div>
        <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
      </div>
      {selectedImage && <button className='min-w-[150px] h-[60px] bg-white rounded-full font-semibold text-[19px] text-black mt-[30px] cursor-pointer' onClick={()=>navigate("/customize2")}>Next</button>}
      
    </div>
  )
}

export default Customize
