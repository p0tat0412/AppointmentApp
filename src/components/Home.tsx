import { FaStar, FaRegStar, FaCalendarAlt, FaClock } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Define Doctor type for better clarity
type Doctor = {
  id: string;
  fullName: string;
  specialty: string;
};

const HomePage = () => {
  const [fullName, setFullName] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const userInfoStr = localStorage.getItem("userInfo");
      const user = userInfoStr ? JSON.parse(userInfoStr) : null;

      try {
        const res = await fetch("/api/user/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setFullName(data.fullName);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const getUtcDays = () => {
    const days = [];
    const formatter = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "numeric",
      timeZone: "UTC",
    });

    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() + i);
      const parts = formatter.formatToParts(date);
      const day = parts.find(p => p.type === "weekday")?.value?.toUpperCase() ?? "";
      const dayNum = parts.find(p => p.type === "day")?.value ?? "";
      days.push({ day, date: dayNum });
    }

    return days;
  };

  const utcDays = getUtcDays();

  const utcToday = new Date();
  const utcTodayString = utcToday.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/doctor");
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Hi, Welcome back
        </h1>
        <p className="text-2xl text-gray-600">{fullName}</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <Link to="/booking">
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <FaCalendarAlt className="text-blue-500" />
            Book Appointment
          </button>
        </Link>
        <Link to="/medical-history">
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <FaClock className="text-blue-500" />
            Upcoming Appointments
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaCalendarAlt className="text-blue-500" />
          <span>Appointment Calendar</span>
        </h2>

        <div className="grid grid-cols-6 gap-2 mb-4">
          {utcDays.map((day, index) => (
            <div
              key={index}
              className={`p-2 text-center rounded-lg ${
                day.day === utcTodayString.slice(0, 3).toUpperCase()
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="font-medium">{day.date}</div>
              <div className="text-sm">{day.day}</div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
            <span>{utcToday.getUTCDate()} {utcTodayString} - Today</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-xl font-semibold mb-4">Favorite Doctors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {doctors.map((doctor, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{doctor.fullName}</h3>
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) =>
                    i < Math.floor(5) ? (
                      <FaStar key={i} />
                    ) : (
                      <FaRegStar key={i} />
                    )
                  )}
                </div>
              </div>
              <p className="text-gray-600 mb-2">{doctor.specialty}</p>
              <Link to={`/booking?doctorId=${doctor.id}`}>
                <button className="mt-3 w-full py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
                  Book Appointment
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
