import React, { useState, useEffect, useRef } from "react";
import { fetchUsers, fetchUserById } from "../../api/userApi";
import { connectWebSocket } from "../../utils/websocket";
import { fetchMessagesBetweenUsers } from "../../api/messageApi";
import { createChatGroup, fetchGroupsByUserId, fetchGroupMessages, getGroupMembers } from "../../api/groupApi";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

const Chat = () => {
  const [users, setUsers] = useState([]); // Danh sách user
  const [toUserId, setToUserId] = useState(""); // ID người nhận
  const [socket, setSocket] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]); // Tin nhắn hiện tại
  const [selectedUser, setSelectedUser] = useState(null); // Thông tin user chi tiết
  const [showSidebar, setShowSidebar] = useState(false);
  const [groupName, setGroupName] = useState(""); // Tên nhóm
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groups, setGroups] = useState([]); // Danh sách nhóm
  const [isGroupChat, setIsGroupChat] = useState(false); // Chat nhóm hay cá nhân
  const [currentGroup, setCurrentGroup] = useState(null); // Nhóm hiện tại
  const userId = localStorage.getItem("userId");
  const messagesEndRef = useRef(null); // Tham chiếu đến phần cuối container tin nhắn
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const user = await fetchUserById(userId);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    loadCurrentUser();
  }, []);

  if (!userId) {
    console.error("User ID not found. Redirecting to login...");
    navigate("/login");
    return null;
  }

  // Cuộn xuống cuối tin nhắn
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const user = await fetchUserById(userId);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    loadCurrentUser();
  }, []);

  // Lấy danh sách user khi component được mount
  useEffect(() => {
    const loadUsers = async () => {
      const userList = await fetchUsers();
      setUsers(userList);
    };
    loadUsers();
  }, []);

  // Lấy danh sách nhóm khi component được mount
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const groupList = await fetchGroupsByUserId(userId);
        setGroups(groupList);
      } catch (error) {
        console.error("Error loading groups:", error);
      }
    };
    loadGroups();
  }, [userId]);

  // Kết nối WebSocket
  useEffect(() => {
    const ws = connectWebSocket(userId, (message) => {
      console.log("Received message from WebSocket:", message);

      if (message.groupId) {
        // Tin nhắn nhóm
        if (isGroupChat && currentGroup?.id === message.groupId) {
          setMessages((prev) => [...prev, message]);
        }
      } else if (
        message.receiverId === parseInt(toUserId, 10) ||
        message.senderId === parseInt(toUserId, 10)
      ) {
        // Tin nhắn cá nhân
        setMessages((prev) => [...prev, message]);
      }
      scrollToBottom(); // Cuộn xuống cuối khi có tin nhắn mới
    });

    setSocket(ws);
    return () => ws.close(); // Cleanup WebSocket
  }, [userId, toUserId, isGroupChat, currentGroup]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Gửi tin nhắn
  const sendMessage = () => {
    if (!socket || !inputValue.trim()) return;

    const messagePayload = {
      senderId: userId,
      content: inputValue,
      groupId: isGroupChat ? currentGroup?.id : null,
      receiverId: isGroupChat ? null : toUserId,
    };

    socket.send(JSON.stringify(messagePayload));
    setInputValue(""); // Clear input
  };

  // Xử lý khi nhấn Enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  // Xử lý khi chọn user
  const handleUserSelect = async (user) => {
    try {
      setIsGroupChat(false); // Chuyển về chat cá nhân
      setToUserId(user.id);
      setSelectedUser(user); // Gán thông tin người dùng
      setCurrentGroup(null); // Xóa trạng thái nhóm
      setShowSidebar(true); // Hiển thị Sidebar

      const chatHistory = await fetchMessagesBetweenUsers(userId, user.id);
      setMessages(chatHistory);
      scrollToBottom(); // Cuộn xuống cuối sau khi tải lịch sử
    } catch (error) {
      console.error("Error fetching user messages:", error);
    }
  };

  // Xử lý khi chọn nhóm
  const handleGroupSelect = async (group) => {
    try {
      setIsGroupChat(true); // Chuyển sang chế độ chat nhóm
      setCurrentGroup(group); // Gán thông tin nhóm
      setSelectedUser(null); // Xóa trạng thái người dùng
      setShowSidebar(true); // Hiển thị Sidebar

      const members = await getGroupMembers(group.id);
      setCurrentGroup((prevGroup) => ({
        ...prevGroup,
        members, // Thêm danh sách thành viên vào nhóm
      }));


      const chatHistory = await fetchGroupMessages(group.id);
      setMessages(chatHistory);
      scrollToBottom(); // Cuộn xuống cuối sau khi tải lịch sử
    } catch (error) {
      console.error("Error fetching group messages:", error);
    }
  };

  // Thêm vào trong component Chat
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert("Vui lòng nhập tên nhóm!");
      return;
    }

    try {
      const chatGroup = await createChatGroup(userId, selectedUser.id, groupName);
      alert(`Nhóm "${chatGroup.name}" đã được tạo thành công!`);
      setGroupName(""); // Reset tên nhóm
      setIsCreatingGroup(false); // Đóng form tạo nhóm
      setShowSidebar(false); // Đóng Sidebar
      setGroups((prevGroups) => [...prevGroups, chatGroup]); // Cập nhật danh sách nhóm
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Không thể tạo nhóm. Vui lòng thử lại.");
    }
  };


  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Left Sidebar */}
      <LeftSidebar

        users={users}
        groups={groups}
        onUserSelect={handleUserSelect}
        onGroupSelect={handleGroupSelect}
        selectedUserId={toUserId}
        currentUser={currentUser}
        onLogout={() => {
          localStorage.removeItem("userId");
          window.location.href = "/login";
        }}
      />

      {/* Main Chat */}
      <div
        className={`flex flex-col ${showSidebar ? "w-[60%]" : "w-[80%]"} transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-300">
          <div className="flex items-center">
            <img
              src={
                isGroupChat
                  ? currentGroup?.avatarUrl
                  : users.find((user) => user.id === toUserId)?.avatarUrl
              }
              alt="avatar"
              className="w-10 h-10 rounded-full mr-3"
            />
            <span className="text-xl font-bold">
              {isGroupChat
                ? currentGroup?.name
                : users.find((user) => user.id === toUserId)?.fullName || "Chọn người dùng"}
            </span>
          </div>
          <button onClick={() => setShowSidebar(!showSidebar)} className="p-2">
            <img src="/src/assets/icon/iconRightSideBar.png" alt="menu" className="w-6 h-6" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-700">
          {messages.map((msg, index) => {
            const isSender = msg.senderId === parseInt(userId, 10);

            // Lấy tên người gửi (dành cho cả nhóm và cá nhân)
            const senderName =
              isSender
                ? "Bạn"
                : (isGroupChat
                  ? currentGroup?.members?.find((member) => member.id === msg.senderId)?.username
                  : users.find((user) => user.id === msg.senderId)?.username) || "Người dùng";
            return (
              <div
                key={index}
                className={`mb-4 ${isSender ? "text-right" : "text-left"} flex flex-col`}
              >
                {/* Tên người gửi */}
                <span className={`text-sm ${isSender ? "text-gray-500" : "text-gray-700"} mb-1`}>
                  {senderName}
                </span>

                {/* Tin nhắn */}
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${isSender ? "bg-blue-500 text-white ml-auto" : "bg-gray-300 text-black mr-auto"
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-300 flex items-center">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress} // Lắng nghe phím Enter
          />
          <button className="ml-4 px-6 py-2 bg-primary text-white font-bold rounded-lg" onClick={sendMessage}>
            Gửi
          </button>
        </div>
      </div>

      {/* Right Sidebar */}
      {showSidebar && (
        <RightSidebar
          selectedUser={selectedUser}
          currentGroup={currentGroup}
          groupName={groupName}
          setGroupName={setGroupName}
          onCreateGroup={handleCreateGroup}
          isCreatingGroup={isCreatingGroup}
          setIsCreatingGroup={setIsCreatingGroup}
          onClose={() => setShowSidebar(false)}
          userId={userId}
        />
      )}
    </div>
  );
};

export default Chat;
