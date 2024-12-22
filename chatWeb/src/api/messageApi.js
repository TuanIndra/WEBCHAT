import axiosInstance from "../utils/axiosConfig";

export const fetchMessages = async (userId1, userId2) => {
  try {
    const response = await axiosInstance.get(`/api/messages/${userId1}/${userId2}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy tin nhắn:", error);
    return [];
  }
};

export const fetchMessagesBetweenUsers = async (userId1, userId2) => {
    try {
      const response = await axiosInstance.get(`api/messages/${userId1}/${userId2}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
};
