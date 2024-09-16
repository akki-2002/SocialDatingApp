import React, { useRef, useState, useEffect } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Conversation/Conversation";
import LogoSearch from "../../components/LogoSearch/LogoSearch";
import NavIcons from "../../components/NavIcons/NavIcons";
import "./Chat.css";
import { getAllUser } from "../../api/UserRequests";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

const Chat = () => {
  const dispatch = useDispatch();
  const socket = useRef();
  const { user } = useSelector((state) => state.authReducer.authData);

  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getAllUser();
    
        const filteredUsers = data.filter((u) => u._id !== user._id);
        setUsers(filteredUsers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [user._id]);


  useEffect(() => {
    socket.current = io("http://localhost:5001", {
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      transports: ['websocket'], 
    });

    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(users);
    });


    console.log("Socket connected:", socket.current);

    return () => {
      socket.current.disconnect();
    };
  }, [user]);

 
  useEffect(() => {
    if (sendMessage) {
      socket.current.emit("sendMessage", sendMessage);
      console.log("Message sent:", sendMessage); 
    }
  }, [sendMessage]);

  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      setReceivedMessage(data);
      console.log("Message received:", data); 
    });
  }, []);

  const checkOnlineStatus = (userId) => {
    const online = onlineUsers.find((user) => user.userId === userId);
    return online ? true : false;
  };

  return (
    <div className="Chat">

      <div className="Left-side-chat">
        <LogoSearch />
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {users.map((u) => (
              <div
                key={u._id}
                onClick={() => {
                  setCurrentChat({ members: [user._id, u._id], _id: `chat-${user._id}-${u._id}` });
                }}
              >
                <Conversation
                  data={u}
                  currentUser={user._id}
                  online={checkOnlineStatus(u._id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          <NavIcons />
        </div>


        <ChatBox
          chat={currentChat}
          currentUser={user._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </div>
  );
};

export default Chat;