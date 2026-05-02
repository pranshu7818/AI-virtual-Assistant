import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { IoMenuSharp } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);

  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [inputText, setInputText] = useState("");
  const [statusText, setStatusText] = useState("Click mic or type below");
  const [ham, setHam] = useState(false);

  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const isSpeakingRef = useRef(false);

  const synth = window.speechSynthesis;

  // 🎤 Start Listening
  const startListening = () => {
    if (
      recognitionRef.current &&
      !isRecognizingRef.current &&
      !isSpeakingRef.current
    ) {
      setStatusText("🎤 Listening...");
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // 🧠 Process Input (Voice + Text)
  const processInput = async (text) => {
    if (!text) return;

    setUserText(text);
    setAiText("");
    setStatusText("Processing...");

    try {
      const data = await getGeminiResponse(text);

      handleCommand(data);
      speak(data.response);

      setAiText(data.response);
      setUserText("");
      setStatusText("Done ✅");
    } catch (err) {
      setStatusText("❌ Error");
    }
  };

  // 🔊 Speak
  const speak = (text) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    isSpeakingRef.current = true;

    utterance.onend = () => {
      isSpeakingRef.current = false;
    };

    synth.speak(utterance);
  };

  // 🎯 Commands
  const handleCommand = (data) => {
    const { type, userInput } = data;

    if (type === "google-search") {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(userInput)}`
      );
    }
  };

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      navigate("/signin");
      setUserData(null);
    } catch {
      setUserData(null);
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onerror = () => {
      setListening(false);
      setStatusText("Try again...");
    };

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      processInput(transcript);
    };

    return () => recognition.stop();
  }, []);

  // 🎨 Dynamic Style (Adaptive Input Box)
  const inputStyle = {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "white",
    backdropFilter: "blur(10px)",
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex flex-col justify-center items-center relative">

      {/* Menu */}
      <IoMenuSharp
        className="text-white absolute top-[20px] right-[20px]"
        onClick={() => setHam(true)}
      />

      <div
        className={`absolute top-0 w-full h-full ${
          ham ? "translate-x-0" : "translate-x-full"
        } transition-transform bg-black/40 backdrop-blur-lg p-6`}
      >
        <RxCross1
          className="text-white text-xl"
          onClick={() => setHam(false)}
        />

        <button
          onClick={handleLogOut}
          className="bg-white px-4 py-2 rounded mt-6 w-full"
        >
          Logout
        </button>

        {/* ⭐ Customize Assistant */}
        <button
          onClick={() => navigate("/customize")}
          className="bg-white px-4 py-2 rounded mt-4 w-full"
        >
          Customize Assistant
        </button>
      </div>

      {/* Avatar */}
      <img
        src={userData?.assistantImage}
        className="w-[200px] h-[250px] object-cover rounded-2xl shadow-lg"
      />

      <h1 className="text-white mt-3 text-lg">
        I'm {userData?.assistantName}
      </h1>

      {!aiText && <img src={userImg} className="w-[120px]" />}
      {aiText && <img src={AiImg} className="w-[120px]" />}

      <h2 className="text-white mt-3 text-center px-4">
        {userText || aiText}
      </h2>

      {/* 🎤 Button */}
      <button
        onClick={startListening}
        className="mt-5 px-6 py-2 bg-white text-black rounded-full"
      >
        🎤 Speak
      </button>

      {/* 💬 Adaptive Input Box */}
      <div className="mt-5 w-[280px] flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask ${userData?.assistantName}...`}
          style={inputStyle}
          className="flex-1 px-4 py-2 rounded-lg outline-none placeholder-gray-300"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              processInput(inputText);
              setInputText("");
            }
          }}
        />

        <button
          onClick={() => {
            processInput(inputText);
            setInputText("");
          }}
          className="bg-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>

      <p className="text-gray-400 mt-3">{statusText}</p>
    </div>
  );
};

export default Home;