import axiosInstance from "../utils/axiosConfig";

export const createChatGroup = async (userId, toUserId, groupName) => {
  try {
    const response = await axiosInstance.post("/api/chat-groups/create", null, {
      params: {
        userId,
        toUserId,
        groupName,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating chat group:", error);
    throw error;
  }
};

export const fetchGroupsByUserId = async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/chat-groups/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching groups:", error);
      throw error;
    }
  };

  export const fetchGroupMessages = async (groupId) => {
    try {
      const response = await axiosInstance.get(`/api/messages/group/${groupId}`)
      return response.data;
    } catch (error) {
      console.error("Error fetching group messages:", error);
      throw error;
    }
  };

  // Tìm kiếm người dùng
export const searchUsers = async (query) => {
  const response = await axiosInstance.get(`/api/chat-groups/search-users`, {
    params: { query },
  });
  return response.data;
};

// Lấy thông tin nhóm
export const getGroupDetails = async (groupId) => {
  const response = await axiosInstance.get(`/api/chat-groups/${groupId}`);
  return response.data;
};

// Thêm người dùng vào nhóm
export const addUserToGroup = async (groupId, userId, requestingUserId) => {
  const response = await axiosInstance.post(`/api/chat-groups/${groupId}/add-user`, null, {
    params: { userId, requestingUserId },
  });
  return response.data;
};

// Lấy danh sách thành viên nhóm
export const getGroupMembers = async (groupId) => {
  try {
      const response = await axiosInstance.get(`/api/chat-groups/groups/${groupId}/members`);
      return response.data;
  } catch (error) {
      console.error("Error fetching group members:", error);
      throw error;
  }
};
export const getGroupMemberCount = async (groupId) => {
  try {
    const response = await axiosInstance.get(`/api/chat-groups/groups/${groupId}/member-count`);
    return response.data; // Trả về giá trị trực tiếp
  } catch (error) {
    console.error("Error fetching group member count:", error);
    throw error;
  }
};

  

