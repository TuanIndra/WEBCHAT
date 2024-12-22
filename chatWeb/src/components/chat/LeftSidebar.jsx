import React, { useState } from "react";

const LeftSidebar = ({ users, groups, onUserSelect, onGroupSelect, selectedUserId, currentUser, onLogout, props }) => {
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => setShowDropdown((prev) => !prev);

    // Lọc danh sách nhóm và người dùng theo từ khóa
    const filteredGroups = groups.filter((group) =>
        group?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredUsers = users.filter((user) =>
        user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Xử lý khi chọn nhóm
    const handleGroupSelect = (group) => {
        setSelectedGroupId(group.id);
        onGroupSelect(group);
    };

    return (
        <div className="w-[20%] bg-white dark:bg-gray-800 p-4 border-r border-gray-300 overflow-y-auto h-full">
            {/* Header với Avatar và Tiêu đề */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Đoạn chat</h2>
                <div className="relative">
                    {currentUser ? (
                        <img
                            src={currentUser.avatarUrl || "/src/assets/defaultUser.png"}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full cursor-pointer"
                            onClick={toggleDropdown}
                        />
                    ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    )}

                    {/* Dropdown */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-lg py-2 z-10">
                            <button
                                onClick={() => window.location.href = "/profile"}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                Thông tin cá nhân
                            </button>
                            <button
                                onClick={onLogout}
                                className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Input tìm kiếm */}
            <input
                type="text"
                placeholder="Tìm kiếm trên CAPYJOY"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full mb-4 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />

            <div className="space-y-4">
                {/* Danh sách nhóm */}
                <h3 className="text-lg font-bold mb-2">Nhóm</h3>
                {filteredGroups.map((group) => (
                    <div
                        key={group.id}
                        onClick={() => handleGroupSelect(group)}
                        className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedGroupId === group.id ? "bg-primary text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                    >
                        <img
                            src={group.avatarUrl || "/src/assets/defaultGroups.png"}
                            alt={group.name || "Nhóm"}
                            className="w-12 h-12 rounded-full bg-gray-300"
                        />
                        <div className="ml-3">
                            <h3 className="font-semibold">{group.name || "Không rõ"}</h3>
                        </div>
                    </div>
                ))}

                {/* Danh sách người dùng */}
                <h3 className="text-lg font-bold mt-4 mb-2">Người dùng</h3>
                {filteredUsers.map((user) => (
                    <div
                        key={user.id}
                        onClick={() => onUserSelect(user)}
                        className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedUserId === user.id && !selectedGroupId
                            ? "bg-primary text-white"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                    >
                        <img
                            src={user.avatarUrl || "/src/assets/defaultUser.png"}
                            alt={user.username}
                            className="w-12 h-12 rounded-full bg-gray-300"
                        />
                        <div className="ml-3">
                            <h3 className="font-semibold">{user.fullName}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.username}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeftSidebar;
