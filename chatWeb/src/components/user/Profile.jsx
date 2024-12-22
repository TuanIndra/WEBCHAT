import React, { useState, useEffect } from "react";
import { fetchUserById } from "../../api/userApi";

const Profile = () => {
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    loadUser();
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-md mx-auto mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <div className="flex flex-col items-center">
        <img
          src={user.avatarUrl || "/src/assets/defaultUser.png"}
          alt={user.username}
          className="w-24 h-24 rounded-full mb-4"
        />
        <h3 className="text-xl font-bold">{user.fullName || "Tên không rõ"}</h3>
        <p className="text-gray-500">@{user.username}</p>
      </div>
      <div className="mt-4">
        <p>
          <strong>Email:</strong> {user.email || "Không rõ"}
        </p>
        <p>
          <strong>Ngày tạo:</strong> {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default Profile;
