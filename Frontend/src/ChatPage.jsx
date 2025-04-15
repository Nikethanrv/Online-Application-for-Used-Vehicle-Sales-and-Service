import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import axios from 'axios'

const ChatPage = () => {
  const [isLoggedIn, setisLoggedIn] = useState(true)

  let seller_id = ''
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token) 
        seller_id = decodedToken.userId
      } catch (error) {
        console.log(error)
      }
      setisLoggedIn(true);
      console.log(seller_id)
      const carDetails = localStorage.getItem('carDetails')
      if (carDetails) console.log(JSON.parse(carDetails))

      // to do: fetch Car ID
    } else {
      setisLoggedIn(false);
    }

  }, []);

  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([
    { sender: "seller", senderName: "John (Seller)", text: "Hello, how can I help you?" },
    { sender: "buyer", senderName: "Tony (You)", text: "I'm interested in the car details." },
  ]);

  const handleSendMessage = () => {
    if (message.trim() || file) {
      const newMessage = {
        sender: "buyer",
        senderName: "Tony (You)", // Replace dynamically from auth later
        text: message,
        file: file ? URL.createObjectURL(file) : null,
        fileType: file ? file.type : null,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div style={chatContainerStyle}>
      <div style={chatWindowStyle}>
        <div style={messageListStyle}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...messageStyle,
                alignSelf: msg.sender === "buyer" ? "flex-end" : "flex-start",
                backgroundColor: msg.sender === "buyer" ? "#2563eb" : "#e5e7eb",
                color: msg.sender === "buyer" ? "#fff" : "#000",
              }}
            >
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>{msg.senderName}</p>
              {msg.text && <p style={{ margin: "4px 0 0 0" }}>{msg.text}</p>}
              {msg.file && (
                msg.fileType.startsWith("image/") ? (
                  <img src={msg.file} alt="shared" style={imageVideoStyle} />
                ) : msg.fileType.startsWith("video/") ? (
                  <video controls style={imageVideoStyle}>
                    <source src={msg.file} type={msg.fileType} />
                    Your browser does not support the video tag.
                  </video>
                ) : null
              )}
            </div>
          ))}
        </div>

        <div style={inputAreaStyle}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={inputStyle}
            placeholder="Type your message..."
          />
          <label htmlFor="file-upload" style={fileLabelStyle}>📎</label>
          <input
            id="file-upload"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button onClick={handleSendMessage} style={sendButtonStyle}>➤</button>
        </div>
      </div>
    </div>
  );
};

// Styles
const chatContainerStyle = {
  padding: "20px",
  fontFamily: "Arial, sans-serif",
  display: "flex",
  justifyContent: "center",
  backgroundColor: "#f9f9f9",
  minHeight: "100vh",
};

const chatWindowStyle = {
  width: "100%",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const messageListStyle = {
  padding: "20px",
  flexGrow: 1,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const messageStyle = {
  borderRadius: "20px",
  padding: "12px 16px",
  maxWidth: "75%",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
};

const inputAreaStyle = {
  display: "flex",
  alignItems: "center",
  padding: "12px",
  backgroundColor: "#f1f5f9",
  borderTop: "1px solid #e2e8f0",
  gap: "10px",
};

const inputStyle = {
  flexGrow: 1,
  padding: "10px 16px",
  borderRadius: "9999px",
  border: "1px solid #cbd5e1",
  fontSize: "15px",
  outline: "none",
};

const sendButtonStyle = {
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  padding: "10px 14px",
  cursor: "pointer",
  fontSize: "16px",
};

const fileLabelStyle = {
  backgroundColor: "#e2e8f0",
  padding: "10px",
  borderRadius: "50%",
  cursor: "pointer",
  fontSize: "16px",
};

const imageVideoStyle = {
  maxWidth: "200px",
  borderRadius: "10px",
  marginTop: "8px",
};

export default ChatPage;
