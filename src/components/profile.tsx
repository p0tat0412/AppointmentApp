import React, { FormEvent, useState, useEffect } from "react";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    dateOfBirth: "",
  });

  const [isEditing, setIsEditing] = useState(false);

    // Fetch profile data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
    const userInfoStr = localStorage.getItem("userInfo");
    const user = userInfoStr ? JSON.parse(userInfoStr) : null;

      try {
        const res = await fetch("http://localhost:5000/api/user/profile",{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        console.log(data)
        setProfile(data);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userInfoStr = localStorage.getItem("userInfo");
    const user = userInfoStr ? JSON.parse(userInfoStr) : null;

    try {
      const response = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token ? `Bearer ${user.token}` : '',
        },
        body: JSON.stringify(profile),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
  
      const result = await response.json();
      console.log("Profile successfully updated:", result);
  
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Profile
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <img
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
            </div>

            <div>
              <label className="block text-md font-bold text-gray-700 mb-1">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="rounded-md bg-gray-100 px-3 py-2 text-gray-900">
                  {profile.fullName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-md font-bold text-gray-700 mb-1">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="rounded-md bg-gray-100 px-3 py-2 text-gray-900">
                  {profile.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-md font-bold text-gray-700 mb-1">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phoneNumber"
                  value={profile.mobileNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="rounded-md bg-gray-100 px-3 py-2 text-gray-900">
                  {profile.mobileNumber || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-md font-bold text-gray-700 mb-1">
                Date Of Birth
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="dateOfBirth"
                  value={profile.dateOfBirth}
                  onChange={handleChange}
                  placeholder="DD/MM/YYYY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                />
              ) : (
                <p className="rounded-md bg-gray-100 px-3 py-2 text-gray-900">
                  {profile.dateOfBirth}
                </p>
              )}
            </div>

            <div className="pt-4">
              {isEditing ? (
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Update Profile
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
