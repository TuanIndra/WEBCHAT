import React, { useState, useEffect } from "react";
import { searchUsers, addUserToGroup, getGroupMembers, getGroupMemberCount } from "../../api/groupApi"; // Import API

const RightSidebar = ({
  selectedUser,
  isCreatingGroup,
  groupName,
  setGroupName,
  setIsCreatingGroup,
  onCreateGroup,
  onClose,
  currentGroup,
  userId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGroupUser, setSelectedGroupUser] = useState(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]); // Danh sách thành viên nhóm
  const [memberCount, setMemberCount] = useState(0); // Số lượng thành viên nhóm

  // Tìm kiếm người dùng
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const users = await searchUsers(searchQuery);
      setSearchResults(users || []);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    }
  };

  // Thêm người dùng vào nhóm
  const handleAddUser = async () => {
    if (!selectedGroupUser || !currentGroup) return;
    try {
      await addUserToGroup(currentGroup.id, selectedGroupUser.id, userId);
      alert("Người dùng đã được thêm vào nhóm!");
      setSearchResults([]);
      setSearchQuery("");
      setIsAddingMember(false);
      // Cập nhật danh sách thành viên sau khi thêm
      fetchGroupDetails();
    } catch (error) {
      console.error("Error adding user to group:", error);
      alert("Không thể thêm người dùng vào nhóm!");
    }
  };

  // Lấy thông tin nhóm: danh sách thành viên và số lượng thành viên
  const fetchGroupDetails = async () => {
    if (!currentGroup) return;

    try {
      const members = await getGroupMembers(currentGroup.id);
      const count = await getGroupMemberCount(currentGroup.id);
      setGroupMembers(members);
      setMemberCount(count);
    } catch (error) {
      console.error("Error fetching group details:", error);
    }
  };

  useEffect(() => {
  const fetchMemberCount = async () => {
    if (currentGroup) {
      try {
        const count = await getGroupMemberCount(currentGroup.id);
        setMemberCount(count); // Cập nhật số lượng thành viên
      } catch (error) {
        console.error("Error fetching member count:", error);
      }
    }
  };

  fetchMemberCount();
}, [currentGroup]); // Chạy lại khi currentGroup thay đổi


  // Tự động gọi fetchGroupDetails khi chọn nhóm
  useEffect(() => {
    if (currentGroup) {
      fetchGroupDetails();
    }
  }, [currentGroup]);

  return (
    <div className="w-[20%] h-full bg-white dark:bg-gray-800 p-4 border-l border-gray-300">
      {currentGroup ? (
        <div className="flex flex-col items-center">
          <img
            src={currentGroup.avatarUrl || "/src/assets/defaultGroups.png"}
            alt="group-avatar"
            className="w-20 h-20 rounded-full mb-4"
          />
          <h3 className="text-lg font-bold">{currentGroup.name || "Tên nhóm không rõ"}</h3>

          <p className="text-sm text-gray-500">
            Số thành viên: {memberCount !== null ? memberCount : "Không rõ"}
          </p>

          {/* Danh sách thành viên */}
          <div className="mt-4 w-full">
            <h4 className="text-md font-bold">Thành viên:</h4>
            <ul className="mt-2 space-y-2">
              {groupMembers.map((member) => (
                <li key={member.id} className="flex items-center space-x-2">
                  <img
                    src={member.avatarUrl || "/src/assets/defaultUser.png"}
                    alt="member-avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm">{member.fullName}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setIsAddingMember(true)}
            className="mt-4 px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition"
          >
            Thêm thành viên
          </button>

          {/* Hiển thị form thêm thành viên */}
          {isAddingMember && (
            <div className="mt-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm người dùng"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white mb-2"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition mb-2"
              >
                Tìm kiếm
              </button>

              {/* Hiển thị kết quả tìm kiếm */}
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedGroupUser(user)}
                    className={`flex items-center p-2 rounded-lg cursor-pointer ${
                      selectedGroupUser?.id === user.id
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <img
                      src={user.avatarUrl || "/src/assets/defaultUser.png"}
                      alt={user.username}
                      className="w-8 h-8 rounded-full bg-gray-300"
                    />
                    <span className="ml-2">{user.fullName}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition"
                >
                  Thêm
                </button>
                <button
                  onClick={() => setIsAddingMember(false)}
                  className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <img
            src={selectedUser.avatarUrl || "/src/assets/defaultGroups.png"}
            alt="avatar"
            className="w-20 h-20 rounded-full mb-4"
          />
          <h3 className="text-lg font-bold">{selectedUser.fullName || "Tên không rõ"}</h3>
          <p className="text-sm text-gray-500">
            {selectedUser.username || "Username không rõ"}
          </p>

          {!isCreatingGroup && (
            <button
              onClick={() => setIsCreatingGroup(true)}
              className="mt-4 px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
            >
              Tạo nhóm với người này
            </button>
          )}

          {isCreatingGroup && (
            <div className="mt-4">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Tên nhóm"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white mb-2"
              />
              <div className="flex justify-between">
                <button
                  onClick={onCreateGroup}
                  className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition"
                >
                  Tạo
                </button>
                <button
                  onClick={() => setIsCreatingGroup(false)}
                  className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-black"
      >
        &#10005;
      </button>
    </div>
  );
};

export default RightSidebar;
