export const connectWebSocket = (userId, onMessageReceived) => {
  if (!userId) {
    console.error("WebSocket connection aborted: Missing userId");
    return null;
  }

  const socket = new WebSocket(`ws://26.11.109.188:8083/Chat?userId=${userId}`);

  socket.onopen = () => {
    console.log(`WebSocket connected for userId=${userId}`);
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
  
    // Gán thời gian hiện tại nếu không có timestamp
    if (!message.timestamp) {
      message.timestamp = new Date().toISOString();
    }
  
    console.log("Received message:", message);
  
    // Phân biệt tin nhắn nhóm hoặc tin nhắn cá nhân
    if (message.groupId) {
      // Xử lý tin nhắn nhóm
      console.log("Group message received:", message);
    } else {
      // Xử lý tin nhắn cá nhân
      console.log("Direct message received:", message);
    }
  
    onMessageReceived(message);
  };
  

  socket.onclose = (event) => {
    console.log("WebSocket connection closed:", event);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return socket;
};
