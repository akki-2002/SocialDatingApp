import React, { useEffect, useState, useRef } from "react";
import { addMessage, getMessages } from "../../api/MessageRequests";
import { getUser } from "../../api/UserRequests";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };


  useEffect(() => {
    if (chat && chat.members) {
      const userId = chat.members.find((id) => id !== currentUser);
      const getUserData = async () => {
        try {
          const { data } = await getUser(userId);
          setUserData(data);
        } catch (error) {
          console.log(error);
        }
      };
      getUserData();
    }
  }, [chat, currentUser]);


  useEffect(() => {
    if (chat && chat._id) {
      const fetchMessages = async () => {
        try {
          const { data } = await getMessages(chat._id);
          setMessages(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchMessages();
    }
  }, [chat]);


  const scroll = useRef();
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleSend = async () => {
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };

    try {
      const { data } = await addMessage(message);
      setMessages((prevMessages) => [...prevMessages, data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }


    setSendMessage({ ...message, receiverId: chat.members.find((id) => id !== currentUser) });
  };

  useEffect(() => {
    if (receivedMessage && chat?.members?.includes(receivedMessage.senderId)) {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    }
  }, [receivedMessage, chat]);

  return (
    <div className="ChatBox-container">
      {chat ? (
        <>
          <div className="chat-header">
            <div className="follower">
              <div>
                <img
                  src={
                    userData?.profilePicture
                      ? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture
                      : process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"
                  }
                  alt="Profile"
                  className="followerImage"
                  style={{ width: "50px", height: "50px" }}
                />
                <div className="name" style={{ fontSize: "0.8rem" }}>
                  <span>{userData?.firstname} {userData?.lastname}</span>
                  <span>@{userData?.username}</span>
                </div>
              </div>
            </div>
            <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
          </div>

          <div className="chat-body">
            {messages.map((message, index) => (
              <div
                key={index}
                ref={scroll}
                className={`message ${message.senderId === currentUser ? "own" : ""}`}
              >
                <span>{message.text}</span>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
          </div>

          <div className="chat-sender">
            <div>+</div>
            <InputEmoji value={newMessage} onChange={handleChange} />
            <button className="send-button button" onClick={handleSend}>
              Send
            </button>
          </div>
        </>
      ) : (
        <span className="chatbox-empty-message">Tap on a chat to start conversation...</span>
      )}
    </div>
  );
};

export default ChatBox;
