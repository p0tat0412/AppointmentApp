import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DoctorDashboard = () => {
  const [fullName, setFullName] = useState("");
  const sections = [
    {
      title: "Appointments",
      description: "Manage and view your upcoming and past patient appointments.",
      link: "/doctor/appointments",
    },
    {
      title: "Availability",
      description: "Set your weekly availability so patients can book slots accordingly.",
      link: "/doctor/availability",
    },
    {
      title: "Profile",
      description: "Update your personal and professional information visible to patients.",
      link: "/profile",
    },
  ];

    // Fetch profile data when component mounts
    useEffect(() => {
      const fetchProfile = async () => {
        const userInfoStr = localStorage.getItem("userInfo");
        const user = userInfoStr ? JSON.parse(userInfoStr) : null;
  
        try {
          const res = await fetch("/api/user/profile", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          });
          if (!res.ok) throw new Error("Failed to fetch profile");
  
          const data = await res.json();
          console.log(data);
          setFullName(data.fullName);
        } catch (err) {
          console.error("Error loading profile:", err);
        }
      };
  
      fetchProfile();
    }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-12">

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Hi, Welcome back
        </h1>
        <p className="text-2xl text-gray-600">{fullName}</p>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Doctor Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {sections.map((section) => (
          <Link
            key={section.title}
            to={section.link}
            className="bg-white hover:shadow-lg transition-shadow duration-200 rounded-2xl p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-[#2563EB] mb-2">
              {section.title}
            </h2>
            <p className="text-gray-600 text-sm">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DoctorDashboard;
